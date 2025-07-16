import React from 'react';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md relative w-96">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                    onClick={onClose}
                >
                    ✕ Close
                </button>
                {children}
            </div>
        </div>
    );
};

export default Popup;
