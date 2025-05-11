import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import connectDB from '@/db/db';
import User from '@/models/User';

export async function GET() {
  try {
    const data = await currentUser()

    if (!data) {
      return new Response('Unauthorized', { status: 401 })
    }
    
    connectDB();
    
    // Check if the user is already registered in the database
    const user = await User.findOne({ clerkId: data.id });
    if (!user) {
      // If not, create a new user in the database
      const newUser = new User({
        clerkId: data.id,
        email: data.emailAddresses[0].emailAddress,
        name: data.firstName ? `${data.firstName} ${data.lastName ?? ''}` : data.username,
        profileImage: data.imageUrl ? data.imageUrl : `https://api.dicebear.com/9.x/thumbs/svg?seed=${data.username}`,
        isVerified: true,
        role: 'user',
      });
      await newUser.save();
    }

    return NextResponse.redirect(new URL('/dashboard', process.env.FRONTEND_URL).toString());
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL('/', process.env.FRONTEND_URL).toString());
  }
}