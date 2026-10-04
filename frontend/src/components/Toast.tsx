import React from 'react';

export interface ToastItem {
  id: string;
  type: 'info' | 'error' | 'success';
  message: string;
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div
      className="fixed z-50 flex flex-col gap-2 pointer-events-none transition-all duration-300
        bottom-20 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-96 sm:max-w-full"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl border backdrop-blur-xl text-xs sm:text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-800/60 shadow-red-950/40'
              : toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800/60 shadow-emerald-950/40'
              : 'bg-neutral-900/95 text-neutral-100 border-neutral-800 shadow-neutral-950/60'
          }`}
        >
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <span className="shrink-0">
              {toast.type === 'error' && '⚠️'}
              {toast.type === 'success' && '✓'}
              {toast.type === 'info' && 'ℹ️'}
            </span>
            <span className="truncate">{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="ml-2 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800/60 shrink-0 transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
