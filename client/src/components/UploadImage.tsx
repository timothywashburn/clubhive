import React, { useState } from 'react';
import { X, Upload, Eye, Trash2 } from 'lucide-react';
import type { ImageData } from '@clubhive/shared';
import { useUploadImage } from '../hooks/uploadImageFiles';

type UploadImageProps = {
    clubId: string;
    multiple?: boolean;
    maxImages?: number;
    aspectRatio?: string; // e.g., "16/9"
    maxFileSizeKB?: number; // in KB
    onSuccess: (images: ImageData[]) => void;
    onError: (error: string) => void;
};

export function UploadImage({ clubId, multiple, maxImages, aspectRatio, maxFileSizeKB, onSuccess, onError }: UploadImageProps) {
    const [images, setImages] = useState<ImageData[]>([]);
    const [uploading, setUploading] = useState(false);

    // Upload image using the custom hook
    const { uploadFile } = useUploadImage({
        clubId,
        maxFileSizeKB,
        onSuccess: image => {
            setImages(prev => [...prev, image]);
            onSuccess([image]);
        },
        onError: error => {
            setUploading(false);
            onError(error);
        },
    });

    // Handle file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (!multiple && files.length > 1) {
            onError('Please select only one image');
            return;
        }

        if (multiple && maxImages && files.length + images.length > maxImages) {
            onError(`You can only upload up to ${maxImages} images`);
            return;
        }

        files.forEach(file => {
            uploadFile(file);
        });
    };

    return (
        <div>
            <input
                className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100
               disabled:opacity-50 disabled:cursor-not-allowed"
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileChange}
                disabled={uploading}
            />
            {uploading && <p>Uploading...</p>}
        </div>
    );
}
