import { useParams } from 'react-router-dom';

/**
 * This class is a static view of the Club Profile page,
 * may be temporary and changed
 */
export function ClubProfile() {
    const { id } = useParams();
    return (
        <div className="bg-background">
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-on-surface mb-2">
                    CS Club
                </h1>
                <p className="text-on-surface-variant mb-6">
                    A club for enthusiasts to learn, code, and have fun.
                </p>

                <button className="mb-6 bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 font-medium">
                    Join Club
                </button>

                <h2 className="text-2xl font-semibold text-on-surface mb-4">
                    Upcoming Events
                </h2>
                <div className="space-y-4">
                    <div className="bg-surface rounded-md p-4 border border-outline-variant">
                        <h3 className="font-medium text-on-surface">
                            Our first GBM of the quarter!
                        </h3>
                        <p className="text-on-surface-variant">
                            Every Thursday at 6PM, Red Shoe ROom
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
