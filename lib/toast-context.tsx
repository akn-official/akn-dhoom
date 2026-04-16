'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (t: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof CheckCircle2; color: string; ring: string }> = {
  success: { icon: CheckCircle2, color: 'text-[#2A8B9D]', ring: 'ring-[#2A8B9D]/30' },
  error: { icon: AlertCircle, color: 'text-red-400', ring: 'ring-red-500/30' },
  info: { icon: Info, color: 'text-[#C87A4F]', ring: 'ring-[#C87A4F]/30' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue['toast']>((t) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);

  const success = useCallback((title: string, description?: string) => toast({ variant: 'success', title, description }), [toast]);
  const error = useCallback((title: string, description?: string) => toast({ variant: 'error', title, description }), [toast]);
  const info = useCallback((title: string, description?: string) => toast({ variant: 'info', title, description }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div
        role="region"
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[120] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] sm:w-auto pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);
  const { icon: Icon, color, ring } = VARIANT_STYLES[toast.variant];

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-zinc-800 ring-1 ${ring} shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.description && <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{toast.description}</p>}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-zinc-500 hover:text-white transition-colors p-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}
