import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';
import { PlayerModel } from '@/lib/models/Player';
import { PaymentModel } from '@/lib/models/Payment';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { playerId } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Find player and verify ownership
    const player = await PlayerModel.findById(playerId);
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    if (player.userId.toString() !== payload.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (player.paymentStatus === 'completed') {
      return NextResponse.json(
        { error: 'Payment already completed' },
        { status: 400 }
      );
    }

    // Generate dummy transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const paymentDate = new Date();
    const amount = 100;

    // Update player payment status
    await PlayerModel.updatePaymentStatus(
      playerId,
      'completed',
      paymentDate,
      transactionId
    );

    // Create payment record
    await PaymentModel.create({
      playerId: new ObjectId(playerId),
      playerName: player.playerName,
      amount,
      paymentStatus: 'completed',
      transactionId,
    });

    return NextResponse.json(
      {
        success: true,
        payment: {
          transactionId,
          amount,
          paymentDate,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

