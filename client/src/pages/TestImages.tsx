import React from 'react';
import { UploadImage } from '../components/UploadImage';
import { useState } from 'react';
import type { ImageData } from '@clubhive/shared';
import { updateClub } from '../hooks/updateClub';

export function TestImages() {
    const [profileImages, setProfileImages] = useState<ImageData[]>([]);
    const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(false);

    const clubId = '507f1f77bcf86cd799439022'; // Define the clubId

    // Simple notification functions
    const showSuccess = (message: string) => {
        alert(message); // Replace with your notification system
    };

    const showError = (message: string) => {
        alert(message); // Replace with your notification system
    };

    return (
        <div>
            <h1>Test Images Page</h1>
            <UploadImage
                clubId={clubId}
                multiple={false}
                aspectRatio="1/1"
                maxFileSizeKB={5000}
                onSuccess={async images => {
                    try {
                        setLoading(true);

                        const updatedClub = await updateClub(clubId, {
                            clubLogo: images[0]._id,
                        });

                        // Update local state - store the uploaded images
                        setProfileImages(images);

                        showSuccess('Profile picture updated!');
                    } catch (error) {
                        showError('Failed to update profile picture: ' + (error as Error).message);
                    } finally {
                        setLoading(false);
                    }
                }}
                onError={error => showError(error)}
            />

            {/* Show loading state */}
            {loading && <p>Updating profile picture...</p>}

            {/* Show current profile image */}
            {profileImages.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600">Current profile picture:</p>
                    <img src={profileImages[0].url} alt="Profile" className="w-32 h-32 object-cover rounded-full mt-2" />
                </div>
            )}
        </div>
    );
}
