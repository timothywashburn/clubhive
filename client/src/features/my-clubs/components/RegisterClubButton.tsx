import { Link } from 'react-router';

export function RegisterClubButton() {
    return (
        <div className=" mt-4">
            <Link to="/register">
                <button
                    type="button"
                    className="px-4 py-2 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-hover cursor-pointer transition "
                >
                    Register New Club
                </button>
            </Link>
        </div>
    );
}
