// src/components/Modal.jsx
import React from 'react';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';

const Modal = ({ type, message, onClose }) => {
    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div
                className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto text-center transform transition-all ${isSuccess ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'
                    }`}
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <div className="flex justify-center mb-4">
                    {isSuccess ? (
                        <IoIosCheckmarkCircle className="text-6xl text-green-500" />
                    ) : (
                        <IoIosCloseCircle className="text-6xl text-red-500" />
                    )}
                </div>
                <p className="text-lg text-gray-700 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;