export function useDeleteImage({ onSuccess, onError }: { onSuccess: (deletedImageId: string) => void; onError: (error: string) => void }) {
    const deleteImage = async (imageId: string) => {
        try {
            const response = await fetch(`/api/images/${imageId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                onSuccess(imageId);
            } else {
                onError('Failed to delete image');
            }
        } catch (error) {
            onError(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    return { deleteImage };
}
