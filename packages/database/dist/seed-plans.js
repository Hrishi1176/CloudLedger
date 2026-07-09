"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding Subscription Plans...');
    // FREE PLAN
    await prisma.subscriptionPlan.upsert({
        where: { code: 'FREE' },
        update: {
            pricing: [
                { country: 'IN', currency: 'INR', price: 0, pricingText: '₹0' },
                { country: 'US', currency: 'USD', price: 0, pricingText: '$0' }
            ],
            aiRequestsPer3Hours: 50, // 50 requests per 3 hours for free
        },
        create: {
            code: 'FREE',
            name: 'Free Starter',
            pricing: [
                { country: 'IN', currency: 'INR', price: 0, pricingText: '₹0' },
                { country: 'US', currency: 'USD', price: 0, pricingText: '$0' }
            ],
            analytics: true,
            maxUsers: 999,
            maxLedgers: 99999,
            allowedModules: ['dashboard', 'chart-of-accounts', 'items', 'vouchers', 'reports'],
            aiRequestsPer3Hours: 50,
            badge: null,
            description: 'Perfect for small business setup and initial double-entry exploration.',
            period: null,
            featuresList: [
                'Up to 999 users',
                'Up to 99999 ledgers',
                'Basic Trial Balance',
                'Real-time Analytics'
            ],
            accentFrom: 'from-slate-400',
            accentTo: 'to-slate-600',
            ring: 'ring-slate-500/30',
            glow: 'shadow-slate-500/10',
            marketingHighlight: false,
        }
    });
    // GROWTH PLAN
    await prisma.subscriptionPlan.upsert({
        where: { code: 'GROWTH' },
        update: {
            pricing: [
                { country: 'IN', currency: 'INR', price: 1499, pricingText: '₹1,499' },
                { country: 'US', currency: 'USD', price: 29, pricingText: '$29' }
            ],
            aiRequestsPer3Hours: 500,
        },
        create: {
            code: 'GROWTH',
            name: 'Growth Pro',
            pricing: [
                { country: 'IN', currency: 'INR', price: 1499, pricingText: '₹1,499' },
                { country: 'US', currency: 'USD', price: 29, pricingText: '$29' }
            ],
            analytics: true,
            maxUsers: 10,
            maxLedgers: 500,
            allowedModules: ['dashboard', 'chart-of-accounts', 'items', 'vouchers', 'reports'],
            aiRequestsPer3Hours: 500,
            badge: 'Most Popular',
            description: 'Unlock full ERP capability, inventory valuation, and advanced reports.',
            period: '/month',
            featuresList: [
                'Up to 10 users',
                'Up to 500 ledgers',
                'Unlimited vouchers',
                'Inventory Tracking & Valuation',
                'Real-time P&L / Balance Sheet'
            ],
            accentFrom: 'from-indigo-500',
            accentTo: 'to-purple-600',
            ring: 'ring-indigo-500/40',
            glow: 'shadow-indigo-500/15',
            marketingHighlight: true,
        }
    });
    // ENTERPRISE PLAN
    await prisma.subscriptionPlan.upsert({
        where: { code: 'ENTERPRISE' },
        update: {
            pricing: [
                { country: 'IN', currency: 'INR', price: 4999, pricingText: '₹4,999' },
                { country: 'US', currency: 'USD', price: 99, pricingText: '$99' }
            ],
            aiRequestsPer3Hours: 999999,
        },
        create: {
            code: 'ENTERPRISE',
            name: 'Enterprise Suite',
            pricing: [
                { country: 'IN', currency: 'INR', price: 4999, pricingText: '₹4,999' },
                { country: 'US', currency: 'USD', price: 99, pricingText: '$99' }
            ],
            analytics: true,
            maxUsers: 999,
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
    });
    console.log('Successfully seeded Subscription Plans!');
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
