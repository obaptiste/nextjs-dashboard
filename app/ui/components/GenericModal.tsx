import { ReactNode } from "react";
import { createPortal } from "react-dom";

type GenericModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export default function GenericModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = "",
}: GenericModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div
          className={`bg-white rounded-lg shadow-lg p-6 max-w-lg w-full ${className}`}
        >
          {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600"
          >
            ✕
          </button>
          <div className="mb-4">{children}</div>
          {footer && <div className="mt-4">{footer}</div>}
        </div>
      </div>
    </>,
    document.body
  );
}
