export interface PlanPricing {
    country: string;
    currency: string;
    price: number;
    pricingText: string;
}
export interface SubscriptionPlan {
    code: string;
    name: string;
    pricing: PlanPricing[];
    analytics: boolean;
    maxUsers: number;
    maxLedgers: number;
    allowedModules: string[];
    aiRequestsPer3Hours: number;
    badge: string | null;
    description: string;
    period: string | null;
    featuresList: string[];
    accentFrom: string;
    accentTo: string;
    ring: string;
    glow: string;
    marketingHighlight: boolean;
}
export declare const SUBSCRIPTION_PLANS: SubscriptionPlan[];
