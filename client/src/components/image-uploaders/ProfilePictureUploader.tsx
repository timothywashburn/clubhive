import React from 'react';
import { BaseImageUploader } from './BaseImageUploader';
import { updateClub } from '../../hooks/updateClub';
import type { ImageData } from '@clubhive/shared';
import { useClubData } from '../../hooks/fetchClub';
import { useDeleteImage } from '../../hooks/deleteImageFile';

// Use this component to upload a profile picture for a club
// It will update the club's logo with the uploaded image
// It's basically a wrapper around BaseImageUploader with specific props for profile pictures

// How to use:
//
// <ProfilePictureUploader
//      clubId={clubId}
//      maxFileSizeKB={5000} // Optional, defaults to 5000 KB
//      onSuccess
//      onError={(error) => console.error('Failed to upload profile picture:', error)}
// />

// note: still need to handle aspect ratio and cropping if needed

// important: this component will delete the club's old profile picture if a new one is uploaded

type ProfilePictureUploaderProps = {
    clubId: string;
    maxFileSizeKB?: number;
    onSuccess?: (imageId: string) => void;
    onError?: (error: string) => void;
};

export function ProfilePictureUploader({ clubId, maxFileSizeKB = 5000, onSuccess, onError }: ProfilePictureUploaderProps) {
    const { club } = useClubData(clubId);

    const { deleteImage } = useDeleteImage({
        onSuccess: deletedImageId => {
            console.log(`Deleted old profile picture: ${deletedImageId}`);
        },
        onError: (error: string) => {
            onError(error);
        },
    });

    const handleSuccess = async (images: ImageData[]) => {
        try {
            const oldProfilePictureId = club?.clubLogo;

            // Update with new profile picture first
            await updateClub(clubId, {
                clubLogo: images[0]._id,
            });

            // Delete old profile picture if it existed
            if (oldProfilePictureId) {
                await deleteImage(oldProfilePictureId);
            }

            onSuccess?.(images[0]._id);
        } catch (error) {
            onError?.(`Failed to update profile picture: ${error.message}`);
        }
    };

    const handleError = (error: string) => {
        onError?.(error);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-on-background">Upload Club Profile Picture</label>
            <BaseImageUploader
                clubId={clubId}
                multiple={false}
                maxImages={1}
                maxFileSizeKB={maxFileSizeKB}
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </div>
    );
}
