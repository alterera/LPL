import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';
import { PlayerModel } from '@/lib/models/Player';
import { PaymentModel } from '@/lib/models/Payment';
import { UserModel } from '@/lib/models/User';
import { ObjectId } from 'mongodb';

const PAYMENT_GATEWAY_API_URL = 'https://api.ekqr.in/api/create_order';
const REGISTRATION_FEE = 1;

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

    // Get player data
    const player = await PlayerModel.findByUserId(payload.userId);
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found. Please complete registration first.' },
        { status: 404 }
      );
    }

    // Check if payment already completed
    if (player.paymentStatus === 'completed') {
      return NextResponse.json(
        { error: 'Payment already completed' },
        { status: 400 }
      );
    }

    // Get user data for email
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate unique client transaction ID
    const clientTxnId = `LPL${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Get base URL for redirect
    const baseUrl = request.headers.get('origin') || request.nextUrl.origin;
    const redirectUrl = `${baseUrl}/api/payments/redirect?client_txn_id=${clientTxnId}`;

    // Prepare payment gateway request
    const paymentGatewayPayload = {
      key: process.env.PAYMENT_GATEWAY_KEY as string,
      client_txn_id: clientTxnId,
      amount: REGISTRATION_FEE.toString(),
      p_info: 'Laharighat Premier League - Player Registration',
      customer_name: player.playerName,
      customer_email: `${user.phone}@laharighatpl.in`, // Using phone as email since User model doesn't have email
      customer_mobile: player.contactNumber,
      redirect_url: redirectUrl,
      udf1: player._id?.toString() || '', // Store player ID in UDF1
      udf2: payload.userId, // Store user ID in UDF2
      udf3: 'player_registration', // Store payment type in UDF3
    };

    // Validate environment variable
    if (!process.env.PAYMENT_GATEWAY_KEY) {
      console.error('PAYMENT_GATEWAY_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Payment gateway configuration error' },
        { status: 500 }
      );
    }

    // Call payment gateway API
    const gatewayResponse = await fetch(PAYMENT_GATEWAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentGatewayPayload),
    });

    const gatewayData = await gatewayResponse.json();

    if (!gatewayData.status || !gatewayData.data) {
      console.error('Payment gateway error:', gatewayData);
      return NextResponse.json(
        { error: gatewayData.msg || 'Failed to create payment order' },
        { status: 400 }
      );
    }

    // Create payment record in database
    const payment = await PaymentModel.create({
      playerId: new ObjectId(player._id),
      playerName: player.playerName,
      amount: REGISTRATION_FEE,
      paymentStatus: 'pending',
      transactionId: clientTxnId, // Temporary, will be updated with actual UPI transaction ID
      orderId: gatewayData.data.order_id,
      clientTxnId: clientTxnId,
      paymentUrl: gatewayData.data.payment_url,
      customerEmail: paymentGatewayPayload.customer_email,
      customerMobile: paymentGatewayPayload.customer_mobile,
    });

    return NextResponse.json({
      success: true,
      payment: {
        orderId: gatewayData.data.order_id,
        paymentUrl: gatewayData.data.payment_url,
        clientTxnId: clientTxnId,
      },
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

