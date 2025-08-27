import React, { useState } from 'react';
import { BaseImageUploader } from './BaseImageUploader';
import type { ImageData } from '@clubhive/shared';

type NotificationImageUploaderProps = {
    clubId: string;
    onImagesChange: (images: ImageData[]) => void;
    onUploadStateChange: (isUploading: boolean) => void;
    maxImages?: number;
    maxFileSizeKB?: number;
};

export function NotificationImageUploader({
    clubId,
    onImagesChange,
    onUploadStateChange,
    maxImages = 5,
    maxFileSizeKB = 5000,
}: NotificationImageUploaderProps) {
    const [images, setImages] = useState<ImageData[]>([]);

    const handleSuccess = (uploadedImages: ImageData[], isUploading = false) => {
        setImages(uploadedImages);
        onImagesChange(uploadedImages); // Pass images back to parent
        onUploadStateChange(isUploading);
    };

    const handleError = (error: string) => {
        console.error(error);
        onUploadStateChange(false);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">Add Photos</label>
            <BaseImageUploader
                clubId={clubId}
                multiple={true}
                maxImages={maxImages}
                maxFileSizeKB={maxFileSizeKB}
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </div>
    );
}
