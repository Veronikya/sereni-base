import { useEffect } from 'react';

interface UseTerminalEventsOptions {
  terminalId: string;
  isRecreatingRef?: React.MutableRefObject<boolean>;
  onExit?: (exitCode: number) => void;
}

export function useTerminalEvents({
  terminalId,
  isRecreatingRef,
  onExit,
}: UseTerminalEventsOptions) {
  useEffect(() => {
    const handleExit = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail?.terminalId === terminalId) {
        onExit?.(detail.exitCode ?? 0);
      }
    };

    window.addEventListener('terminal-exit', handleExit);
    return () => {
      window.removeEventListener('terminal-exit', handleExit);
    };
  }, [terminalId, onExit]);
}
