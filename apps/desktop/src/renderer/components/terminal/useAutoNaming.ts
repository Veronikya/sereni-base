import { useCallback } from 'react';

interface UseAutoNamingOptions {
  terminalId: string;
  cwd?: string;
}

interface UseAutoNamingReturn {
  handleCommandEnter: (command: string) => void;
  cleanup: () => void;
}

export function useAutoNaming({
  terminalId,
  cwd,
}: UseAutoNamingOptions): UseAutoNamingReturn {
  const handleCommandEnter = useCallback((command: string) => {
    // Auto-naming logic can be extended later
  }, []);

  const cleanup = useCallback(() => {
    // Cleanup logic
  }, []);

  return { handleCommandEnter, cleanup };
}
