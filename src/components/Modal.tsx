import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidth} bg-white rounded-xl shadow-xl border border-ink-200 animate-scale-in`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
            <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-ink-400 hover:text-ink-700 rounded-lg p-1 hover:bg-ink-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading,
  danger,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-ink-600 leading-relaxed mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="h-10 px-4 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-100 disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`h-10 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50 ${
            danger ? 'bg-red-600 hover:bg-red-700' : 'bg-ink-900 hover:bg-ink-800'
          }`}
        >
          {loading ? 'Please wait...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
