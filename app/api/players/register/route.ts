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
      bowlingStyle,
      battingStyle,
      primaryRole,
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
      !emergencyPhone ||
      !primaryRole ||
      typeof primaryRole !== 'string'
    ) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate bowling and batting styles based on primary role
    const isAllRounder = primaryRole === 'All Rounder';
    const isBowler = primaryRole === 'Bowler';
    const isBatsman = primaryRole === 'Batsman';
    const isWicketKeeper = primaryRole === 'Wicket Keeper';

    // Validate bowling style
    if (isAllRounder || isBowler) {
      if (!bowlingStyle || !Array.isArray(bowlingStyle) || bowlingStyle.length === 0) {
        return NextResponse.json(
          { error: 'Bowling style is required for All Rounder and Bowler roles' },
          { status: 400 }
        );
      }
    }

    // Validate batting style
    if (isAllRounder || isBatsman) {
      if (!battingStyle || !Array.isArray(battingStyle) || battingStyle.length === 0) {
        return NextResponse.json(
          { error: 'Batting style is required for All Rounder and Batsman roles' },
          { status: 400 }
        );
      }
    }

    // For wicket keeper, bowling and batting styles are optional, but if provided should be arrays
    if (isWicketKeeper) {
      if (bowlingStyle && !Array.isArray(bowlingStyle)) {
        return NextResponse.json(
          { error: 'Bowling style must be an array' },
          { status: 400 }
        );
      }
      if (battingStyle && !Array.isArray(battingStyle)) {
        return NextResponse.json(
          { error: 'Batting style must be an array' },
          { status: 400 }
        );
      }
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
      bowlingStyle: bowlingStyle || [],
      battingStyle: battingStyle || [],
      primaryRole,
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

