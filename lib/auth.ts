import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { User } from './models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  phone: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  if (!user._id) {
    throw new Error('User ID is required to generate token');
  }
  const payload: JWTPayload = {
    userId: user._id.toString(),
    phone: user.phone,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// For Node.js runtime (API routes)
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// For Edge Runtime (middleware) - uses jose library
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    console.log('🔐 verifyTokenEdge called with token (first 20 chars):', token.substring(0, 20) + '...');
    console.log('🔑 JWT_SECRET exists:', !!JWT_SECRET);
    console.log('🔑 JWT_SECRET length:', JWT_SECRET?.length || 0);
    
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const decoded = {
      userId: payload.userId as string,
      phone: payload.phone as string,
      role: payload.role as string,
    };
    
    console.log('✅ Token verified successfully:', JSON.stringify(decoded, null, 2));
    return decoded;
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  return cookies['auth-token'] || null;
}

