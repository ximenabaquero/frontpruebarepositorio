"use client";

type AlertModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
};

export default function AlertModal({
  isOpen,
  title,
  message,
  onClose,
  buttonText = "Aceptar",
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
