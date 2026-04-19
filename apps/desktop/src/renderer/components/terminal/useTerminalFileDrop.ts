import { useState, useCallback } from 'react';

interface UseTerminalFileDropOptions {
  terminalId: string;
}

interface UseTerminalFileDropReturn {
  isNativeDragOver: boolean;
  handleNativeDragOver: (e: React.DragEvent) => void;
  handleNativeDragLeave: (e: React.DragEvent) => void;
  handleNativeDrop: (e: React.DragEvent) => void;
}

export function useTerminalFileDrop({
  terminalId,
}: UseTerminalFileDropOptions): UseTerminalFileDropReturn {
  const [isNativeDragOver, setIsNativeDragOver] = useState(false);

  const handleNativeDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.stopPropagation();
      setIsNativeDragOver(true);
    }
  }, []);

  const handleNativeDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNativeDragOver(false);
  }, []);

  const handleNativeDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNativeDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const paths = files
      .map((f) => (f as File & { path?: string }).path)
      .filter(Boolean)
      .join(' ');

    if (paths) {
      window.electronAPI.sendTerminalInput(terminalId, paths + ' ');
    }
  }, [terminalId]);

  return {
    isNativeDragOver,
    handleNativeDragOver,
    handleNativeDragLeave,
    handleNativeDrop,
  };
}
