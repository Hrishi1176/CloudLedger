import * as jose from 'jose';

// Standardized fallback secret (must be at least 256 bits / 32 characters in production)
const secretString = process.env.JWT_SECRET || 'sales-crm-development-super-secret-key-32-chars-long';
const JWT_SECRET = new TextEncoder().encode(secretString);

export interface JWTPayload {
  userId: string;
  email: string;
  organizationId: string;
  role: string;
  subdomain: string;
}

export async function signJWT(payload: JWTPayload, expiry: string = '24h'): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}
