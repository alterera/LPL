import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/lib/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, password } = body;

    // Validation
    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, phone, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findByPhone(phone);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 400 }
      );
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({
      name,
      phone,
      password: hashedPassword,
      role: 'user',
    });

    // Generate token
    const token = generateToken(user);

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id?.toString(),
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

