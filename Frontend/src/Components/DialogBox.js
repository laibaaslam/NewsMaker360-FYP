import React, { useEffect } from 'react';
const Dialog = ({ message, onClose }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            // Restore scroll when dialog is unmounted
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-opacity-25  bg-black  backdrop-blur-sm font-poppins flex items-center justify-center z-50">

            {/* fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 */}
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                <p className="text-gray-800">{message}</p>
                <div className="flex justify-center mt-4"> {/* Center the close button */}
                    <button onClick={onClose} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dialog;