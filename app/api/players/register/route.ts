import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';
import { PlayerModel } from '@/lib/models/Player';
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

    // Check if player already registered
    const existingPlayer = await PlayerModel.findByUserId(payload.userId);
    if (existingPlayer) {
      return NextResponse.json(
        { error: 'Player already registered' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      playerPhoto,
      playerName,
      contactNumber,
      dateOfBirth,
      aadharNumber,
      village,
      postOffice,
      policeStation,
      city,
      gpSelection,
      parentName,
      parentContact,
      emergencyContactName,
      emergencyPhone,
    } = body;

    // Validation
    if (
      !playerPhoto ||
      !playerName ||
      !contactNumber ||
      !dateOfBirth ||
      !aadharNumber ||
      !village ||
      !postOffice ||
      !policeStation ||
      !city ||
      !gpSelection ||
      !parentName ||
      !parentContact ||
      !emergencyContactName ||
      !emergencyPhone
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create player
    const player = await PlayerModel.create({
      userId: new ObjectId(payload.userId),
      playerPhoto,
      playerName,
      contactNumber,
      dateOfBirth: new Date(dateOfBirth),
      aadharNumber,
      village,
      postOffice,
      policeStation,
      city,
      gpSelection,
      parentName,
      parentContact,
      emergencyContactName,
      emergencyPhone,
    });

    return NextResponse.json(
      {
        success: true,
        player: {
          id: player._id?.toString(),
          playerName: player.playerName,
          paymentStatus: player.paymentStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

