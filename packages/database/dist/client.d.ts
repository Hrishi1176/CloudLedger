import { PrismaClient as AdminPrismaClient } from '@prisma/client-admin';
import { PrismaClient as TenantPrismaClient } from '@prisma/client-tenant';
declare const adminPrismaClientSingleton: () => AdminPrismaClient<import("@prisma/client-admin").Prisma.PrismaClientOptions, never, import("@prisma/client-admin/runtime/library").DefaultArgs>;
declare global {
    var prismaAdminGlobal: undefined | ReturnType<typeof adminPrismaClientSingleton>;
    var tenantClients: Record<string, TenantPrismaClient>;
}
export declare const adminDb: AdminPrismaClient<import("@prisma/client-admin").Prisma.PrismaClientOptions, never, import("@prisma/client-admin/runtime/library").DefaultArgs>;
export declare function getTenantDb(subdomain: string): Promise<TenantPrismaClient>;
export declare const db: any;
export {};
