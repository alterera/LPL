import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Validate environment variables
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { error: "ImageKit configuration error" },
        { status: 500 }
      );
    }

    // Generate upload authentication parameters
    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey,
      // Optional: Set expiry time (default is 1 hour, max 1 hour)
      // expire: 30 * 60, // 30 minutes
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error("Error generating upload auth params:", error);
    return NextResponse.json(
      { error: "Failed to generate upload credentials" },
      { status: 500 }
    );
  }
}

