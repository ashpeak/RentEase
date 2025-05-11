import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import { SignJWT } from 'jose';

export async function POST(req: any) {
  try {
    const body = await req.json();
    const userId = body.token;
    
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Create a JWT token with the user's Clerk ID
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(process.env.JWT_SECRET || 'default-secret-key-change-in-production');
    
    const token = await new SignJWT({ 
      sub: userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0]?.emailAddress
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secretKey);
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
