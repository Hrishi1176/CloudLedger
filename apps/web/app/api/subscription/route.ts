import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminDb } from '@sales-crm/database';
import { verifyJWT } from '@sales-crm/auth';
import { SUBSCRIPTION_PLANS } from '@sales-crm/shared';

export async function POST(request: Request) {
  try {
    const tokenStore = await cookies();
    const token = tokenStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    const allowedPlans = SUBSCRIPTION_PLANS.map(p => p.code);
    if (!plan || !allowedPlans.includes(plan.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid plan name' }, { status: 400 });
    }

    const normalizedPlan = plan.toUpperCase();

    // Update organization's subscription plan
    await adminDb.organization.update({
      where: { id: payload.organizationId },
      data: { subscriptionPlan: normalizedPlan }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${normalizedPlan}`,
      plan: normalizedPlan
    });
  } catch (error: any) {
    console.error('Subscription API error:', error);
    return NextResponse.json({ error: 'Failed to update subscription', details: error.message }, { status: 500 });
  }
}
