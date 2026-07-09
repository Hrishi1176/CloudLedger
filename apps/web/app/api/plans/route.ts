import { NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '@sales-crm/shared';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country') || 'IN';

    const plans = SUBSCRIPTION_PLANS;

    // Format the plans for the frontend based on the country
    const formattedPlans = plans.map(plan => {
      const pricing = plan.pricing.find(p => p.country === country) || plan.pricing[0];
      
      return {
        id: plan.code, // using code as ID for backward compatibility
        name: plan.name,
        price: pricing.pricingText,
        period: plan.period,
        badge: plan.badge,
        description: plan.description,
        features: plan.featuresList,
        accentFrom: plan.accentFrom,
        accentTo: plan.accentTo,
        ring: plan.ring,
        glow: plan.glow,
        highlight: plan.marketingHighlight,
      };
    });

    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
