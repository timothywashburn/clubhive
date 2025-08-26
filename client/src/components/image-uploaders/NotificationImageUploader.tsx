import React, { useState } from 'react';
import { BaseImageUploader } from './BaseImageUploader';
import type { ImageData } from '@clubhive/shared';

type NotificationImageUploaderProps = {
    clubId: string;
    onImagesChange: (images: ImageData[]) => void;
    maxImages?: number;
    maxFileSizeKB?: number;
};

export function NotificationImageUploader({ clubId, onImagesChange, maxImages = 5, maxFileSizeKB = 5000 }: NotificationImageUploaderProps) {
    const [images, setImages] = useState<ImageData[]>([]);

    const handleSuccess = (uploadedImages: ImageData[]) => {
        setImages(uploadedImages);
        onImagesChange(uploadedImages); // Pass images back to parent
    };

    const handleError = (error: string) => {
        console.error(error);
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
