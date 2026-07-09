import { NextResponse } from 'next/server';
import { adminDb, getTenantDb } from '@sales-crm/database';
import { hashPassword } from '@sales-crm/auth';
import { registerSchema } from '@sales-crm/shared';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate Input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, companyName, subdomain, country, plan } = result.data;
    const normalizedSubdomain = subdomain.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    // 2. Check if subdomain is already taken
    const existingOrg = await adminDb.organization.findUnique({
      where: { subdomain: normalizedSubdomain }
    });
    if (existingOrg) {
      return NextResponse.json(
        { error: 'Subdomain is already taken' },
        { status: 400 }
      );
    }

    // 3. Check if email is already taken
    const existingUser = await adminDb.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 400 }
      );
    }

    // 4. Hash password
    const passwordHash = await hashPassword(password);

    // 5. Create Organization in Admin DB
    const organization = await adminDb.organization.create({
      data: {
        name: companyName,
        subdomain: normalizedSubdomain,
        country,
        subscriptionPlan: plan || 'FREE'
      }
    });

    // 6. Connect to new Tenant DB and setup default roles/permissions
    const tenantDb = await getTenantDb(normalizedSubdomain);

    // Create default Permissions
    const permissionsList = [
      { action: 'read:dashboard', description: 'Read dashboard metrics' },
      { action: 'read:customers', description: 'Read customer profiles' },
      { action: 'write:customers', description: 'Create and edit customers' },
      { action: 'read:products', description: 'Read product catalog' },
      { action: 'write:products', description: 'Create and edit products' },
      { action: 'read:sales', description: 'Read sales orders and quotations' },
      { action: 'write:sales', description: 'Create sales orders and quotations' }
    ];

    // Ensure permissions exist in database
    const createdPermissions = await Promise.all(
      permissionsList.map(async (perm) => {
        return tenantDb.permission.upsert({
          where: { action: perm.action },
          update: {},
          create: perm
        });
      })
    );

    // Create Admin Role for this Organization linked to all permissions
    const adminRole = await tenantDb.role.create({
      data: {
        name: 'ADMIN',
        permissionIds: createdPermissions.map(p => p.id)
      }
    });

    // 7. Create User in Admin DB
    const user = await adminDb.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        organizationId: organization.id,
        roleId: adminRole.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Organization and user created successfully',
      organization: { id: organization.id, name: organization.name, subdomain: organization.subdomain },
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration', details: error.message },
      { status: 500 }
    );
  }
}
