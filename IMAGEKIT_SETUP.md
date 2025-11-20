# ImageKit Setup Guide

This project uses ImageKit for image uploads. Follow these steps to configure ImageKit.

## 1. Get ImageKit Credentials

1. Sign up for a free account at [ImageKit.io](https://imagekit.io)
2. Go to your [Dashboard](https://imagekit.io/dashboard)
3. Navigate to **Developer Options** → **API Keys**
4. Copy the following:
   - **Public API Key**
   - **Private API Key**
   - **URL Endpoint** (e.g., `https://ik.imagekit.io/your_imagekit_id`)

## 2. Add to Environment Variables

Add the following to your `.env` or `.env.local` file:

```env
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### Example:

```env
IMAGEKIT_PUBLIC_KEY=public_abc123xyz789
IMAGEKIT_PRIVATE_KEY=private_xyz789abc123
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/myimagekitid
```

## 3. Install Dependencies

Make sure you have installed the ImageKit Next.js SDK:

```bash
npm install @imagekit/next
```

## 4. How It Works

- **Upload Authentication API** (`/api/upload-auth`): Generates secure upload credentials on the server side
- **Image Upload Component** (`components/ui/image-upload.tsx`): Handles client-side file uploads to ImageKit
- **Security**: Private API key never leaves the server, ensuring secure uploads

## 5. File Organization

Uploaded images are automatically organized in the folder: `/cricket-club/players/`

You can change this in `components/ui/image-upload.tsx` by modifying the `folder` parameter in the `upload()` function.

## Important Notes

- **Never commit your `.env` file** to version control
- Keep your **Private API Key** secure and never expose it in client-side code
- The upload authentication happens server-side for security

