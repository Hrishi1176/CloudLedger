"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.adminDb = void 0;
exports.getTenantDb = getTenantDb;
const client_admin_1 = require("@prisma/client-admin");
const client_tenant_1 = require("@prisma/client-tenant");
const adminPrismaClientSingleton = () => {
    return new client_admin_1.PrismaClient();
};
// ── Admin DB Client ──
exports.adminDb = globalThis.prismaAdminGlobal ?? adminPrismaClientSingleton();
if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaAdminGlobal = exports.adminDb;
}
// ── Tenant DB Factory ──
async function getTenantDb(subdomain) {
    const normalizedSubdomain = subdomain.toLowerCase();
    if (!globalThis.tenantClients) {
        globalThis.tenantClients = {};
    }
    if (globalThis.tenantClients[normalizedSubdomain]) {
        return globalThis.tenantClients[normalizedSubdomain];
    }
    // Get the base connection URL (usually the admin DB url)
    const baseUrl = process.env.DATABASE_URL;
    if (!baseUrl) {
        throw new Error('DATABASE_URL is not defined in environment variables');
    }
    // Replace the database name in the MongoDB connection string
    // Assumes a format like: mongodb+srv://user:pass@cluster.mongodb.net/cloudledger-admin?retryWrites=true
    // We want to change "cloudledger-admin" to "tenant_subdomain"
    const tenantUrl = baseUrl.replace(/\/[^/?]+(\?|$)/, `/tenant_${normalizedSubdomain}$1`);
    const client = new client_tenant_1.PrismaClient({
        datasources: {
            db: {
                url: tenantUrl,
            },
        },
    });
    globalThis.tenantClients[normalizedSubdomain] = client;
    return client;
}
// For backwards compatibility during the refactoring process
// This should eventually be removed once all references are updated
exports.db = exports.adminDb;
