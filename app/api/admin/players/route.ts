import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';
import { PlayerModel } from '@/lib/models/Player';

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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '0');
    const page = parseInt(searchParams.get('page') || '1');
    const paymentStatus = searchParams.get('paymentStatus') as 'pending' | 'completed' | undefined;

    // Get players
    const filter: { paymentStatus?: 'pending' | 'completed' } = {};
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    let players = await PlayerModel.findAll(filter);
    const totalPlayers = players.length;

    // Apply pagination if limit is specified
    if (limit > 0) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      players = players.slice(startIndex, endIndex);
    }

    return NextResponse.json({
      success: true,
      players: players.map(player => ({
        id: player._id?.toString(),
        playerName: player.playerName,
        playerPhoto: player.playerPhoto,
        aadharNumber: player.aadharNumber,
        contactNumber: player.contactNumber,
        registrationDate: player.registrationDate,
        paymentStatus: player.paymentStatus,
        paymentDate: player.paymentDate,
        transactionId: player.transactionId,
        bowlingStyle: player.bowlingStyle || [],
        battingStyle: player.battingStyle || [],
        primaryRole: player.primaryRole || '',
      })),
      pagination: limit > 0 ? {
        total: totalPlayers,
        page,
        limit,
        totalPages: Math.ceil(totalPlayers / limit),
      } : null,
    });
  } catch (error) {
    console.error('Get players error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

