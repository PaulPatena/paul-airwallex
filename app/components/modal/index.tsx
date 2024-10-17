import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode; // This will allow you to pass any content into the modal
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
