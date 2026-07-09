import { PrismaClient as AdminPrismaClient } from '@prisma/client-admin';
import { PrismaClient as TenantPrismaClient } from '@prisma/client-tenant';

const adminPrismaClientSingleton = () => {
  return new AdminPrismaClient();
};

declare global {
  var prismaAdminGlobal: undefined | ReturnType<typeof adminPrismaClientSingleton>;
  var tenantClients: Record<string, TenantPrismaClient>;
}

// ── Admin DB Client ──
export const adminDb = globalThis.prismaAdminGlobal ?? adminPrismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaAdminGlobal = adminDb;
}

// ── Tenant DB Factory ──
export async function getTenantDb(subdomain: string): Promise<TenantPrismaClient> {
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

  const client = new TenantPrismaClient({
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
export const db = adminDb as any;
