import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';
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

    // Get all payments
    const payments = await PaymentModel.findAll();

    return NextResponse.json({
      success: true,
      payments: payments.map(payment => ({
        id: payment._id?.toString(),
        playerName: payment.playerName,
        amount: payment.amount,
        date: payment.date,
        paymentStatus: payment.paymentStatus,
        transactionId: payment.transactionId,
      })),
    });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

