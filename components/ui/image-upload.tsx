'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from '@imagekit/next';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Authenticates and retrieves the necessary upload credentials from the server.
   */
  const authenticator = async () => {
    try {
      const response = await fetch('/api/upload-auth');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Authentication request failed');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError('');
    setIsUploading(true);
    setUploadProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Create new AbortController for this upload
    abortControllerRef.current = new AbortController();

    try {
      // Get authentication parameters
      const authParams = await authenticator();
      const { signature, expire, token, publicKey } = authParams;

      // Upload to ImageKit
      const uploadResponse = await upload({
        file,
        fileName: file.name,
        signature,
        expire,
        token,
        publicKey,
        folder: '/cricket-club/players', // Optional: organize files in folders
        useUniqueFileName: true, // Generate unique filename to avoid conflicts
        onProgress: (event) => {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        },
        abortSignal: abortControllerRef.current.signal,
      });

      // Upload successful
      if (uploadResponse.url) {
        onImageUpload(uploadResponse.url);
        setError('');
      } else {
        throw new Error('Upload response missing URL');
      }
    } catch (uploadError) {
      // Handle specific error types
      if (uploadError instanceof ImageKitAbortError) {
        setError('Upload was cancelled');
        setPreview(null);
      } else if (uploadError instanceof ImageKitInvalidRequestError) {
        setError(uploadError.message || 'Invalid upload request');
        setPreview(null);
      } else if (uploadError instanceof ImageKitUploadNetworkError) {
        setError('Network error. Please check your connection and try again.');
        setPreview(null);
      } else if (uploadError instanceof ImageKitServerError) {
        setError('Server error. Please try again later.');
        setPreview(null);
      } else {
        console.error('Upload error:', uploadError);
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : 'Failed to upload image'
        );
        setPreview(null);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  };

  const handleRemoveImage = () => {
    // Cancel ongoing upload if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
    setUploadProgress(0);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Player preview"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <Button
              type="button"
              onClick={handleClick}
              disabled={isUploading}
              variant="outline"
              className="w-full"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Uploading... {Math.round(uploadProgress)}%
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {preview ? 'Change Photo' : 'Upload Photo'}
                </>
              )}
            </Button>
            {isUploading && uploadProgress > 0 && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Upload a clear photo of the player. Maximum file size: 5MB. Supported
        formats: JPG, PNG, GIF.
      </p>
    </div>
  );
};

export default ImageUpload;
