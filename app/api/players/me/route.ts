import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';
import { PlayerModel } from '@/lib/models/Player';

export async function GET(request: NextRequest) {
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

    // Find player
    const player = await PlayerModel.findByUserId(payload.userId);

    if (!player) {
      return NextResponse.json(
        { success: true, player: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      player: {
        id: player._id?.toString(),
        playerPhoto: player.playerPhoto,
        playerName: player.playerName,
        contactNumber: player.contactNumber,
        dateOfBirth: player.dateOfBirth,
        aadharNumber: player.aadharNumber,
        village: player.village,
        postOffice: player.postOffice,
        policeStation: player.policeStation,
        city: player.city,
        gpSelection: player.gpSelection,
        parentName: player.parentName,
        parentContact: player.parentContact,
        emergencyContactName: player.emergencyContactName,
        emergencyPhone: player.emergencyPhone,
        registrationDate: player.registrationDate,
        paymentStatus: player.paymentStatus,
        paymentDate: player.paymentDate,
        transactionId: player.transactionId,
      },
    });
  } catch (error) {
    console.error('Get player error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

