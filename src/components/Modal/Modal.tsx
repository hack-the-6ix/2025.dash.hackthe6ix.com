import React from "react";

export default function Modal({
  open,
  onClose,
  children
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/20 z-[1000] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 min-w-[340px] max-w-[500px] w-[90vw] text-center relative">
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-none border-none text-2xl text-gray-400 cursor-pointer"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
