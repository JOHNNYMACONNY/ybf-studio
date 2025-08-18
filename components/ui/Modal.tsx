import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen?: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ 
  children, 
  onClose, 
  isOpen = true, 
  title,
  size = 'md'
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      default:
        return 'max-w-lg';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative z-[10000] w-full ${getSizeClasses()} max-h-[90vh] overflow-y-auto`}>
        <div className="bg-neutral-900 rounded-lg shadow-xl border border-neutral-700">
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-100">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className={title ? 'p-6' : 'p-6'}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
