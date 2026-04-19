import { useEffect, useRef, useCallback } from 'react';
import { useTerminalStore } from '../../stores/terminal-store';

interface UsePtyProcessOptions {
  terminalId: string;
  cwd?: string;
  projectPath?: string;
  cols: number;
  rows: number;
  skipCreation?: boolean;
  isRecreatingRef?: React.MutableRefObject<boolean>;
  onCreated?: () => void;
  onError?: (error: string) => void;
}

interface UsePtyProcessReturn {
  prepareForRecreate: () => void;
  resetForRecreate: () => void;
}

export function usePtyProcess({
  terminalId,
  cwd,
  cols,
  rows,
  skipCreation,
  isRecreatingRef,
  onCreated,
  onError,
}: UsePtyProcessOptions): UsePtyProcessReturn {
  const updateTerminal = useTerminalStore((s) => s.updateTerminal);

  const prepareForRecreate = useCallback(() => {
    // Mark terminal as not created so effect skips until reset
  }, []);

  const resetForRecreate = useCallback(() => {
    // Allow effect to recreate PTY with new cwd
  }, []);

  useEffect(() => {
    if (skipCreation) return;

    const createPty = async () => {
      try {
        await window.electronAPI.createTerminal(terminalId, { cwd, cols, rows });
        updateTerminal(terminalId, { status: 'idle' });
        onCreated?.();
      } catch (err) {
        onError?.(err instanceof Error ? err.message : String(err));
      }
    };

    createPty();
  }, [terminalId, cwd, cols, rows, skipCreation]); // eslint-disable-line react-hooks/exhaustive-deps

  return { prepareForRecreate, resetForRecreate };
}
