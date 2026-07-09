import { NextResponse } from 'next/server';
import { adminDb, getTenantDb } from '@sales-crm/database';
import { verifyPassword, signJWT } from '@sales-crm/auth';
import { loginSchema } from '@sales-crm/shared';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate Input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase();

    // 2. Fetch User and Organization
    const user = await adminDb.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        organization: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Fetch Role from Tenant DB
    const tenantDb = await getTenantDb(user.organization.subdomain);
    const role = user.roleId ? await tenantDb.role.findUnique({ where: { id: user.roleId } }) : null;
    const roleName = role?.name || 'USER';

    // 3. Verify Password
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 4. Verify Subdomain Match
    // Extract subdomain from request host
    const hostHeader = request.headers.get('host') || '';
    const host = hostHeader.split(':')[0];
    const parts = host.split('.');
    let requestSubdomain = '';
    
    const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
    if (!isIP) {
      if (parts.includes('localhost')) {
        if (parts.length > 1 && parts[0] !== 'localhost') {
          requestSubdomain = parts[0];
        }
      } else {
        if (parts.length > 2 && parts[0] !== 'www') {
          requestSubdomain = parts[0];
        } else if (parts.length === 2 && parts[1] === 'me') {
          requestSubdomain = parts[0];
        }
      }
    }

    if (requestSubdomain && requestSubdomain !== user.organization.subdomain) {
      return NextResponse.json(
        { error: 'You do not have access to this organization space' },
        { status: 403 }
      );
    }

    // 5. Sign JWT
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: roleName,
      subdomain: user.organization.subdomain
    });

    // 6. Set HTTP-Only Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          subdomain: user.organization.subdomain
        }
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
