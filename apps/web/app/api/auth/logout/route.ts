import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const loginUrl = new URL('/login', `${protocol}://${host}`);
  
  const response = NextResponse.redirect(loginUrl);
  
  response.cookies.delete('token');
  
  return response;
}
