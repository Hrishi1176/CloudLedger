import { streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { adminDb } from '@sales-crm/database';
import { SUBSCRIPTION_PLANS } from '@sales-crm/shared';

export const maxDuration = 30;

const ollama = createOllama();

// Only initialize Redis if env vars are present (to prevent build errors)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? Redis.fromEnv()
  : null;

export async function POST(req: Request) {
  let activeConcurrentKey: string | null = null;
  try {
    const { messages, organizationId } = await req.json();

    // Default to 'FREE' if no organizationId is provided for fallback
    let planCode = 'FREE';
    if (organizationId) {
      const org = await adminDb.organization.findUnique({
        where: { id: organizationId },
      });
      if (org) {
        planCode = org.subscriptionPlan;
      }
    }

    const plan = SUBSCRIPTION_PLANS.find(p => p.code === planCode);

    const aiLimit = plan?.aiRequestsPer3Hours || 50;
    
    // --- SCALABLE RATE LIMITING (Concurrent & 3-Hour Window) ---
    if (redis) {
      // 1. Concurrent Request Limit (e.g., max 2 concurrent requests per org)
      activeConcurrentKey = `concurrent_ai_${organizationId || 'anonymous'}`;
      const activeCount = await redis.incr(activeConcurrentKey);
      
      // Auto-expire the concurrent key after 1 minute to prevent deadlocks if a request crashes
      if (activeCount === 1) {
        await redis.expire(activeConcurrentKey, 60);
      }

      if (activeCount > 2) {
        // Decrease it back since we are rejecting
        await redis.decr(activeConcurrentKey);
        activeConcurrentKey = null;
        return new Response(JSON.stringify({ error: 'Too many concurrent AI requests. Please wait for the current one to finish.' }), { status: 429 });
      }

      // 2. 3-Hour Window Limit
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(aiLimit, '3 h'),
        analytics: true,
      });

      const identifier = `ai_limit_${organizationId || 'anonymous'}`;
      const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

      if (!success) {
        if (activeConcurrentKey) {
          await redis.decr(activeConcurrentKey);
          activeConcurrentKey = null;
        }
        return new Response(JSON.stringify({ 
          error: `AI Rate limit exceeded. You are limited to ${limit} requests per 3 hours. Try again later.` 
        }), { status: 429 });
      }
    }

    const result = await streamText({
      // @ts-ignore
      model: ollama('llama3.1'),
      messages,
      system: 'You are CloudLedger AI, a helpful CRM and financial assistant. Provide concise and accurate answers. Be highly professional and quick.',
      maxTokens: 500,
      onFinish: async () => {
        // Clean up the concurrent tracking when the stream finishes
        if (redis && activeConcurrentKey) {
          await redis.decr(activeConcurrentKey);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    if (redis && activeConcurrentKey) {
      await redis.decr(activeConcurrentKey).catch(() => {});
    }
    return new Response(JSON.stringify({ error: error.message || 'Failed to connect to AI provider.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
