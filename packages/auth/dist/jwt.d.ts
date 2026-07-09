export interface JWTPayload {
    userId: string;
    email: string;
    organizationId: string;
    role: string;
    subdomain: string;
}
export declare function signJWT(payload: JWTPayload, expiry?: string): Promise<string>;
export declare function verifyJWT(token: string): Promise<JWTPayload | null>;
