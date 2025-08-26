import type { ImageData } from '@clubhive/shared';

export function useUploadImage({
    clubId,
    maxFileSizeKB,
    onSuccess,
    onError,
}: {
    clubId: string;
    maxFileSizeKB?: number;
    onSuccess: (image: ImageData) => void;
    onError: (error: string) => void;
}) {
    const uploadFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            onError('Please select an image file');
            return;
        }
        if (maxFileSizeKB && file.size > maxFileSizeKB * 1024) {
            onError(`File size exceeds ${maxFileSizeKB} KB`);
            return;
        }
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('clubId', clubId);

            const response = await fetch('/api/images', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                onSuccess(data.image);
            } else {
                onError(data.error?.message || 'Failed to upload image');
            }
        } catch (error) {
            onError(error instanceof Error ? error.message : 'Upload failed');
        }
    };

    return { uploadFile };
}
