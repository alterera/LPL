import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';
import { UserModel } from '@/lib/models/User';
import { PlayerModel } from '@/lib/models/Player';
import { PaymentModel } from '@/lib/models/Payment';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get statistics
    const [totalPlayers, totalUsers, totalMoney] = await Promise.all([
      PlayerModel.count({ paymentStatus: 'completed' }),
      UserModel.findAll().then((users) => users.length),
      PaymentModel.getTotalAmount(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalPlayers,
        totalUsers,
        totalMoney,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

