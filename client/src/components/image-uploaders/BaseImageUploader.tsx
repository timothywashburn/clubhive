import React, { useState, useRef } from 'react';
import { Eye, X } from 'lucide-react';
import type { ImageData } from '@clubhive/shared';
import { useUploadImage } from '../../hooks/useUploadImage.ts';
import { useDeleteImage } from '../../hooks/useDeleteImageFile.ts';

// BaseImageUploader is a generic image uploader component that can be wrapped by components like ProfilePictureUploader
// It handles file selection, preview, upload, and deletion of images
// It can be customized with props like max file size, multiple uploads, etc.
// You won't really need to use this directly, but it serves as a foundation for more specific uploaders like ProfilePictureUploader

type BaseImageUploaderProps = {
    clubId: string;
    multiple?: boolean;
    maxImages?: number;
    maxFileSizeKB?: number;
    onSuccess: (images: ImageData[]) => void;
    onError: (error: string) => void;
};

export function BaseImageUploader({ clubId, maxImages, maxFileSizeKB, onSuccess, onError }: BaseImageUploaderProps) {
    const [uploadedImages, setUploadedImages] = useState<ImageData[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { uploadFile } = useUploadImage({
        clubId,
        maxFileSizeKB,
        onSuccess: image => {
            setUploadedImages(prev => {
                const updated = [...prev, image];
                onSuccess(updated);
                return updated;
            });
        },
        onError: error => {
            setUploading(false);
            onError(error);
        },
    });

    const { deleteImage } = useDeleteImage({
        onSuccess: () => {
            onSuccess(uploadedImages);
        },
        onError: error => onError(error),
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (maxImages && files.length > maxImages) {
            onError(`You can only upload up to ${maxImages} images`);
            return;
        }

        // Check file sizes
        const oversizedFiles = files.filter(file => file.size > (maxFileSizeKB || Infinity) * 1024);
        if (oversizedFiles.length > 0) {
            onError(`File size exceeds ${maxFileSizeKB} KB: ${oversizedFiles.map(f => f.name).join(', ')}`);
            return;
        }

        setSelectedFiles(files);
        // Create thumbnails for preview
        const newThumbnails = files.map(file => URL.createObjectURL(file));
        setThumbnails(newThumbnails);
    };

    const handleRemoveSelectedFile = (indexToRemove: number) => {
        URL.revokeObjectURL(thumbnails[indexToRemove]);
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setThumbnails(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            onError('No files selected for upload');
            return;
        }

        setUploading(true);
        try {
            // Upload each selected file
            for (const file of selectedFiles) {
                await uploadFile(file);
            }
            // Clear selected files and thumbnails after successful upload
            setSelectedFiles([]);
            setThumbnails([]);
        } catch (error) {
            onError(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteAll = () => {
        // Delete all uploaded images
        uploadedImages.forEach(img => deleteImage(img._id));
        setUploadedImages([]);
        setSelectedFiles([]);
        setThumbnails([]);
    };

    const hasUploaded = uploadedImages.length > 0;
    const hasSelected = selectedFiles.length > 0;

    return (
        <div className="space-y-4">
            {/* Show thumbnails of selected files (before upload) OR uploaded images (after upload) */}
            <div className="relative">
                {/* Selected files thumbnails (before upload) */}
                {hasSelected && !hasUploaded && (
                    <div className="flex gap-3 flex-wrap">
                        {thumbnails.map((thumb, idx) => (
                            <div key={idx} className="relative w-32 h-32">
                                <img src={thumb} alt={`Selected ${idx + 1}`} className="w-full h-full object-cover rounded-md border" />
                                <button
                                    type="button"
                                    onClick={() => setPreviewImage(thumb)}
                                    className="hover: cursor-pointer absolute top-1 left-1 p-1 bg-white rounded-full border border-gray-300 hover:bg-gray-100"
                                    title="Preview image"
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSelectedFile(idx)}
                                    className="hover: cursor-pointer absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    title="Remove from selection"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Uploaded images (after upload) */}
                {hasUploaded && (
                    <div className="flex gap-3 flex-wrap">
                        {uploadedImages.map((image, idx) => (
                            <div key={image._id} className="relative w-32 h-32">
                                <img src={image.url} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover rounded-md border" />
                                <button
                                    type="button"
                                    onClick={() => setPreviewImage(image.url)}
                                    className="absolute top-1 left-1 p-1 bg-white rounded-full hover:bg-gray-100"
                                    title="Preview image"
                                >
                                    <Eye size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* File Input - disabled after upload */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        disabled={uploading || hasUploaded}
                        className="hidden"
                        ref={fileInputRef}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || hasUploaded}
                        className="px-4 py-2 text-sm font-medium rounded-md
                        bg-surface border border-outline-variant text-on-surface
                        hover:bg-surface-variant hover: cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Choose Files
                    </button>
                    {hasSelected && (
                        <span className="text-sm text-on-background-variant">
                            {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                            {maxImages && ` (max ${maxImages})`}
                        </span>
                    )}
                </div>
            </div>

            {/* Upload Button - only show when files are selected and nothing uploaded yet */}
            {hasSelected && !hasUploaded && (
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="text-sm px-4 py-2 rounded-md font-semibold
              bg-primary text-on-primary hover:cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}`}
                </button>
            )}

            {/* Delete All Button - only show if there are uploaded images */}
            {hasUploaded && (
                <button
                    type="button"
                    onClick={handleDeleteAll}
                    className="text-sm px-4 py-2 font-semibold bg-error text-on-error rounded-md hover:bg-red-600"
                    title="Delete all images"
                >
                    Delete All
                </button>
            )}

            {/* Modal Preview */}
            {previewImage && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-h-[90%] max-w-3xl">
                        <img src={previewImage} alt="Preview" className="rounded-lg max-h-full max-w-full object-contain" />
                        <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
