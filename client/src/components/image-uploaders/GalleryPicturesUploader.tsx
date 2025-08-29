import { BaseImageUploader } from './BaseImageUploader';
import { updateClub } from '../../utils/updateClub.ts';
import type { ImageData } from '@clubhive/shared';
import { useClubData } from '../../hooks/useClubData.ts';
import { useDeleteImage } from '../../hooks/useDeleteImageFile.ts';

// Use this component to upload gallery pictures for a club
// It will completely replace the club's pictures array with the uploaded images
// It's basically a wrapper around BaseImageUploader with specific props for gallery pictures

// How to use:
//
// <GalleryPicturesUploader
//      clubId={clubId}
//      maxImages={10} // Optional, defaults to 10
//      maxFileSizeKB={5000} // Optional, defaults to 5000 KB
// />

// important: this component will always replace and delete all old gallery pictures every time the user uploads a new gallery of photos,
// basically, it assumes the user wants to manage gallery pictures as a single batch every time

type GalleryPicturesUploaderProps = {
    clubId: string;
    maxImages?: number;
    maxFileSizeKB?: number;
    onSuccess?: (imageIds: string[]) => void;
    onError?: (error: string) => void;
};

export function GalleryPicturesUploader({
    clubId,
    maxImages = 10,
    maxFileSizeKB = 5000,
    onSuccess,
    onError,
}: GalleryPicturesUploaderProps) {
    const { club } = useClubData(clubId);

    const { deleteImage } = useDeleteImage({
        onSuccess: deletedImageId => {
            console.log(`Deleted old gallery picture: ${deletedImageId}`);
        },
        onError: (error: string) => {
            onError?.(error);
        },
    });

    const handleSuccess = async (images: ImageData[]) => {
        try {
            const newImageIds = images.map(img => img._id);
            const oldPictureIds = club?.pictures || [];

            // Update club with new pictures first
            await updateClub(clubId, {
                pictures: newImageIds,
            });

            // Delete old pictures if they existed
            if (oldPictureIds.length > 0) {
                for (const oldPictureId of oldPictureIds) {
                    try {
                        await deleteImage(oldPictureId);
                    } catch (deleteError) {
                        console.warn(`Failed to delete old picture ${oldPictureId}:`, deleteError);
                    }
                }
            }

            onSuccess?.(newImageIds);
        } catch (error) {
            onError?.(`Failed to update gallery pictures: ${error.message}`);
        }
    };

    const handleError = (error: string) => {
        onError?.(error);
    };

    const currentPictureCount = club?.pictures?.length || 0;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-on-background">Upload Gallery Pictures</label>
            </div>

            <BaseImageUploader
                clubId={clubId}
                multiple={true}
                maxImages={maxImages}
                maxFileSizeKB={maxFileSizeKB}
                onSuccess={handleSuccess}
                onError={handleError}
            />

            {currentPictureCount > 0 && (
                <p className="text-xs text-error">
                    Note: Uploading new images will replace all {currentPictureCount} existing gallery pictures.
                </p>
            )}
        </div>
    );
}
