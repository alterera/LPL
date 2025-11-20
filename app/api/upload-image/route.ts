import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  // console.log('📤 [Upload] Starting image upload request...');
  
  try {
    // Step 1: Parse form data
    // console.log('📥 [Upload] Step 1: Parsing form data...');
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      // console.error('❌ [Upload] No file provided');
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // console.log('✅ [Upload] File received:', {
    //   name: file.name,
    //   type: file.type,
    //   size: `${(file.size / 1024).toFixed(2)} KB`,
    // });

    // Step 2: Validate file type
    // console.log('🔍 [Upload] Step 2: Validating file type...');
    if (!file.type.startsWith('image/')) {
      // console.error('❌ [Upload] Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Step 3: Validate file size
    // console.log('📏 [Upload] Step 3: Validating file size...');
    if (file.size > 5 * 1024 * 1024) {
      // console.error('❌ [Upload] File too large:', file.size);
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Step 4: Convert File to Buffer
    // console.log('🔄 [Upload] Step 4: Converting file to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // console.log('✅ [Upload] Buffer created:', {
    //   bufferSize: `${(buffer.length / 1024).toFixed(2)} KB`,
    // });

    // Step 5: Check Cloudinary config
    // console.log('⚙️ [Upload] Step 5: Checking Cloudinary configuration...');
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    // console.log('🔑 [Upload] Cloudinary config:', {
    //   cloudName: cloudName ? `${cloudName.substring(0, 4)}...` : 'MISSING',
    //   apiKey: apiKey ? `${apiKey.substring(0, 4)}...` : 'MISSING',
    //   apiSecret: apiSecret ? '***' : 'MISSING',
    // });

    if (!cloudName || !apiKey || !apiSecret) {
      // console.error('❌ [Upload] Missing Cloudinary credentials');
      return NextResponse.json(
        { error: 'Cloudinary configuration error' },
        { status: 500 }
      );
    }

    // Step 6: Upload to Cloudinary using buffer upload (more reliable than stream)
    // console.log('☁️ [Upload] Step 6: Uploading to Cloudinary...');
    // console.log('📤 [Upload] Upload options:', {
    //   folder: 'cricket-club/players',
    //   resource_type: 'image',
    // });

    // Convert buffer to base64 data URI for more reliable upload
    const base64String = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64String}`;
    
    // console.log('📊 [Upload] Data URI created:', {
    //   dataUriLength: `${(dataUri.length / 1024).toFixed(2)} KB`,
    //   mimeType: file.type,
    // });

    // Use upload method with timeout
    const uploadOptions = {
      folder: 'cricket-club/players',
      resource_type: 'image' as const,
      timeout: 60000, // 60 second timeout
    };

    // console.log('⏱️ [Upload] Starting upload with timeout:', uploadOptions.timeout, 'ms');
    const startTime = Date.now();

    // Retry logic for connection errors
    let result: any = null;
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // console.log(`🔄 [Upload] Attempt ${attempt}/${maxRetries}...`);
        result = await cloudinary.uploader.upload(dataUri, uploadOptions);
        // console.log(`✅ [Upload] Attempt ${attempt} succeeded`);
        break; // Success, exit retry loop
      } catch (uploadError: any) {
        lastError = uploadError instanceof Error ? uploadError : new Error(String(uploadError));
        const errorCode = (uploadError as any)?.code || (uploadError as any)?.http_code;
        const errorMessage = uploadError instanceof Error ? uploadError.message : String(uploadError);

        // console.error(`❌ [Upload] Attempt ${attempt} failed:`, {
        //   error: errorMessage,
        //   code: errorCode,
        //   name: uploadError instanceof Error ? uploadError.name : undefined,
        //   fullError: JSON.stringify(uploadError, Object.getOwnPropertyNames(uploadError)),
        // });

        // If it's a connection error and we have retries left, wait and retry
        if (
          (errorCode === 'ECONNRESET' || 
           errorCode === 'ETIMEDOUT' || 
           errorMessage.includes('ECONNRESET') ||
           errorMessage.includes('ETIMEDOUT') ||
           errorMessage.includes('ECONNREFUSED')) &&
          attempt < maxRetries
        ) {
          const waitTime = attempt * 1000; // Exponential backoff: 1s, 2s, 3s
          // console.log(`⏳ [Upload] Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        // If it's not a connection error or we're out of retries, throw
        if (attempt === maxRetries) {
          throw uploadError;
        }
      }
    }

    if (!result) {
      throw lastError || new Error('Upload failed after all retries');
    }
    
    const uploadTime = Date.now() - startTime;
    // console.log('✅ [Upload] Upload successful:', {
    //   public_id: result.public_id,
    //   url: result.secure_url?.substring(0, 50) + '...',
    //   uploadTime: `${uploadTime}ms`,
    // });

    // console.log('🎉 [Upload] Upload completed successfully');
    return NextResponse.json({
      success: true,
      url: result.secure_url || result.url,
    });
  } catch (error) {
    console.error('💥 [Upload] Fatal error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      errorObject: error,
    });
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 }
    );
  }
}

