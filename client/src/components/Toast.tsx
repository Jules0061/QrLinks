import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CheckIcon, AlertIcon } from './Icons';

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
  leaving: boolean;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const push = useCallback((type: Toast['type'], message: string) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, type, message, leaving: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    }, 2600);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const api: ToastApi = {
    success: (m) => push('success', m),
    error: (m) => push('error', m),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`glass flex items-center gap-2.5 !rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
              t.leaving ? 'translate-y-3 opacity-0' : 'animate-rise'
            } ${t.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}
          >
            {t.type === 'success' ? <CheckIcon width={16} height={16} /> : <AlertIcon width={16} height={16} />}
            <span className="text-gray-100">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
