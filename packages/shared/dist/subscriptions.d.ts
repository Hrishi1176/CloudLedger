export interface SubscriptionPlanFeatures {
    analytics: boolean;
    maxUsers: number;
    maxLedgers: number;
    allowedModules: string[];
}
export interface SubscriptionPlanUI {
    badge: string | null;
    description: string;
    period: string | null;
    pricingText: string;
    featuresList: string[];
    accentFrom: string;
    accentTo: string;
    ring: string;
    glow: string;
    marketingHighlight: boolean;
}
export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    features: SubscriptionPlanFeatures;
    ui: SubscriptionPlanUI;
}
