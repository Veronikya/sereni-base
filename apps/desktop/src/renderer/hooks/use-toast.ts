import { useCallback } from 'react';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

interface ToastReturn {
  toast: (options: ToastOptions) => void;
}

export function useToast(): ToastReturn {
  const toast = useCallback((options: ToastOptions) => {
    // Stub: integrate with actual toast library (sonner, react-hot-toast, etc.)
    console.log('[Toast]', options.title, options.description);
  }, []);

  return { toast };
}
