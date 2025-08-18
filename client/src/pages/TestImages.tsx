import { ProfilePictureUploader } from '../components/image-uploaders/ProfilePictureUploader';
import { GalleryPicturesUploader } from '../components/image-uploaders/GalleryPicturesUploader';
import { useToast } from '../hooks/useToast';

// TestImages component is a simple page to test image uploaders
// It uses the ProfilePictureUploader to upload a profile picture for a club

export function TestImages() {
    const clubId = '507f1f77bcf86cd799439022'; // this is the CS club's ID for testing
    const { successToast, errorToast } = useToast();

    return (
        <div className="p-4">
            <h1 className="text-on-background text-lg font-bold">Test Images Page</h1>
            <div className="flex flex-col gap-4 mt-4 align-items-center">
                {/* Profile Image Upload Example*/}
                <ProfilePictureUploader
                    clubId={clubId}
                    maxFileSizeKB={5000} // Optional, defaults to 5000 KB
                    onSuccess={() => successToast('Updated Profile Picture!')}
                />

                <GalleryPicturesUploader
                    clubId={clubId}
                    maxImages={10} // Optional, defaults to 10
                    maxFileSizeKB={5000} // Optional, defaults to 5000 KB
                />
            </div>
        </div>
    );
}
