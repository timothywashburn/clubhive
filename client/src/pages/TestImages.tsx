import { BaseImageUploader } from '../components/BaseImageUploader';
import { updateClub } from '../hooks/updateClub';

export function TestImages() {
    const clubId = '507f1f77bcf86cd799439022'; // this is the CS club's ID for testing

    return (
        <div className="p-4">
            <h1 className="text-on-background text-lg font-bold">Test Images Page</h1>
            <div className="flex flex-col gap-4 mt-4 align-items-center">
                {/* Profile Image Upload Example*/}
                <p className="text-on-background-variant">Upload a profile image:</p>
                <BaseImageUploader
                    clubId={clubId}
                    maxImages={1}
                    maxFileSizeKB={5000}
                    onSuccess={async images => {
                        try {
                            await updateClub(clubId, {
                                clubLogo: images[0]._id,
                            });
                        } catch (error) {
                            alert('Failed to update profile picture: ' + (error as Error).message);
                        }
                    }}
                    onError={error => alert(error)}
                />
            </div>
        </div>
    );
}
