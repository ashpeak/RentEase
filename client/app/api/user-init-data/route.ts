import { NextResponse } from 'next/server';
import connectDB from '@/db/db';
import User from '@/models/User';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clerkId = searchParams.get('clerkId');

  if (!clerkId) {
    return NextResponse.json({ error: 'Missing clerkId parameter' }, { status: 400 });
  }

  try {
    connectDB();
    const userData = await User.findOne({ clerkId: clerkId });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}