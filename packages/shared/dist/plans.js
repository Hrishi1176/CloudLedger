"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_PLANS = void 0;
exports.SUBSCRIPTION_PLANS = [
    {
        code: 'FREE',
        name: 'Free Starter',
        pricing: [
            { country: 'IN', currency: 'INR', price: 0, pricingText: '₹0' },
            { country: 'US', currency: 'USD', price: 0, pricingText: '$0' }
        ],
        analytics: true,
        maxUsers: 10,
        maxLedgers: 50,
        allowedModules: ['dashboard', 'chart-of-accounts', 'items', 'vouchers', 'reports'],
        aiRequestsPer3Hours: 50,
        badge: null,
        description: 'Perfect for small business setup and initial double-entry exploration.',
        period: '/month',
        featuresList: [
            'Up to 10 users',
            'Up to 50 ledgers',
            'Basic Trial Balance',
            'Real-time Analytics'
        ],
        accentFrom: 'from-slate-400',
        accentTo: 'to-slate-600',
        ring: 'ring-slate-500/30',
        glow: 'shadow-slate-500/10',
        marketingHighlight: false,
    },
    {
        code: 'STARTER',
        name: 'Starter',
        pricing: [
            { country: 'IN', currency: 'INR', price: 49, pricingText: '₹49' },
            { country: 'US', currency: 'USD', price: 2, pricingText: '$2' }
        ],
        analytics: true,
        maxUsers: 25,
        maxLedgers: 100,
        allowedModules: ['dashboard', 'chart-of-accounts', 'items', 'vouchers', 'reports'],
        aiRequestsPer3Hours: 100,
        badge: null,
        description: 'A great step up for growing businesses needing more capacity.',
        period: '/month',
        featuresList: [
            'Up to 25 users',
            'Up to 100 ledgers',
            'Basic Trial Balance',
            'Inventory Tracking'
        ],
        accentFrom: 'from-cyan-400',
        accentTo: 'to-blue-500',
        ring: 'ring-cyan-500/30',
        glow: 'shadow-cyan-500/10',
        marketingHighlight: false,
    },
    {
        code: 'BASIC',
        name: 'Basic',
        pricing: [
            { country: 'IN', currency: 'INR', price: 99, pricingText: '₹99' },
            { country: 'US', currency: 'USD', price: 5, pricingText: '$5' }
        ],
        analytics: true,
        maxUsers: 50,
        maxLedgers: 500,
        allowedModules: ['dashboard', 'chart-of-accounts', 'items', 'vouchers', 'reports'],
        aiRequestsPer3Hours: 200,
        badge: 'Popular',
        description: 'Unlock basic ERP capability, and advanced reports.',
        period: '/month',
        featuresList: [
            'Up to 50 users',
            'Up to 500 ledgers',
            'Unlimited vouchers',
            'Inventory Tracking'
        ],
        accentFrom: 'from-blue-500',
        accentTo: 'to-blue-600',
        ring: 'ring-blue-500/40',
        glow: 'shadow-blue-500/15',
        marketingHighlight: false,
    },
    {
        code: 'PRO',
        name: 'Pro',
        pricing: [
            { country: 'IN', currency: 'INR', price: 199, pricingText: '₹199' },
            { country: 'US', currency: 'USD', price: 10, pricingText: '$10' }
        ],
        analytics: true,
        maxUsers: 100,
        maxLedgers: 2000,
        allowedModules: ['dashboard', 'chart-of-accounts', 'items', 'vouchers', 'reports'],
        aiRequestsPer3Hours: 500,
        badge: 'Most Popular',
        description: 'Unlock full ERP capability, inventory valuation, and advanced reports.',
        period: '/month',
        featuresList: [
            'Up to 100 users',
            'Up to 2000 ledgers',
            'Unlimited vouchers',
            'Inventory Tracking & Valuation',
            'Real-time P&L / Balance Sheet'
        ],
        accentFrom: 'from-indigo-500',
        accentTo: 'to-purple-600',
        ring: 'ring-indigo-500/40',
        glow: 'shadow-indigo-500/15',
        marketingHighlight: true,
    },
    {
        code: 'PREMIUM',
        name: 'Premium',
        pricing: [
            { country: 'IN', currency: 'INR', price: 299, pricingText: '₹299' },
            { country: 'US', currency: 'USD', price: 15, pricingText: '$15' }
        ],
        analytics: true,
        maxUsers: 500,
        maxLedgers: 10000,
        allowedModules: ['dashboard', 'chart-of-accounts', 'items', 'vouchers', 'reports'],
        aiRequestsPer3Hours: 1500,
        badge: 'High Performance',
        description: 'For mid-size companies with heavy transaction volumes.',
        period: '/month',
        featuresList: [
            'Up to 500 users',
            'Up to 10000 ledgers',
            'Unlimited vouchers',
            'Priority AI Support',
            'Advanced Reporting'
        ],
        accentFrom: 'from-violet-500',
        accentTo: 'to-fuchsia-500',
        ring: 'ring-violet-500/40',
        glow: 'shadow-violet-500/15',
        marketingHighlight: false,
    },
    {
        code: 'ENTERPRISE',
        name: 'Enterprise Suite',
        pricing: [
            { country: 'IN', currency: 'INR', price: 499, pricingText: '₹499' },
            { country: 'US', currency: 'USD', price: 25, pricingText: '$25' }
        ],
        analytics: true,
        maxUsers: 99999,
        maxLedgers: 99999,
        allowedModules: ['dashboard', 'chart-of-accounts', 'items', 'vouchers', 'reports'],
        aiRequestsPer3Hours: 999999,
        badge: 'Full Access',
        description: 'Designed for large teams needing unlimited scale and audit capabilities.',
        period: '/month',
        featuresList: [
            'Unlimited users',
            'Unlimited ledgers & items',
            'Multi-currency support',
            'Advanced User Permissions',
            'Dedicated agent support'
        ],
        accentFrom: 'from-pink-500',
        accentTo: 'to-purple-600',
        ring: 'ring-pink-500/30',
        glow: 'shadow-pink-500/10',
        marketingHighlight: false,
    }
];
