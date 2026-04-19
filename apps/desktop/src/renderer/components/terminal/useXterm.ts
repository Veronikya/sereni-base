import { useEffect, useRef, useCallback, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useTerminalStore } from '../../stores/terminal-store';

interface UseXtermOptions {
  terminalId: string;
  onCommandEnter?: (command: string) => void;
  onResize?: (cols: number, rows: number) => void;
  onDimensionsReady?: (cols: number, rows: number) => void;
}

interface UseXtermReturn {
  terminalRef: React.RefObject<HTMLDivElement>;
  xtermRef: React.RefObject<Terminal>;
  fit: () => boolean;
  write: (data: string) => void;
  writeln: (data: string) => void;
  focus: () => void;
  dispose: () => void;
  cols: number;
  rows: number;
}

export function useXterm({
  terminalId,
  onCommandEnter,
  onResize,
  onDimensionsReady,
}: UseXtermOptions): UseXtermReturn {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [cols, setCols] = useState(80);
  const [rows, setRows] = useState(24);

  // Initialize xterm
  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#0B0B0F',
        foreground: '#E4E4E7',
        cursor: '#A1A1AA',
      },
      scrollback: 10000,
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.open(terminalRef.current);

    // Perform initial fit
    const success = fitAddon.fit();
    if (success) {
      const { cols: c, rows: r } = terminal;
      setCols(c);
      setRows(r);
      onDimensionsReady?.(c, r);
    }

    fitAddonRef.current = fitAddon;
    xtermRef.current = terminal;

    // Handle resize
    const handleResize = () => {
      const result = fitAddon.fit();
      if (result) {
        const { cols: c, rows: r } = terminal;
        setCols(c);
        setRows(r);
        onResize?.(c, r);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      terminal.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [terminalId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track commands
  useEffect(() => {
    const terminal = xtermRef.current;
    if (!terminal) return;

    let currentLine = '';
    let commandHistory: string[] = [];
    let historyIndex = -1;

    const handleData = (data: string) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        // Enter
        if (currentLine.trim()) {
          commandHistory.push(currentLine);
          onCommandEnter?.(currentLine);
        }
        currentLine = '';
        historyIndex = commandHistory.length;
      } else if (code === 127) {
        // Backspace
        currentLine = currentLine.slice(0, -1);
      } else if (code === 27) {
        // Escape sequence
        if (data === '\x1b[A') {
          // Arrow up
          if (historyIndex > 0) {
            historyIndex--;
            currentLine = commandHistory[historyIndex] || '';
          }
        } else if (data === '\x1b[B') {
          // Arrow down
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            currentLine = commandHistory[historyIndex] || '';
          } else {
            historyIndex = commandHistory.length;
            currentLine = '';
          }
        }
      } else if (code >= 32) {
        currentLine += data;
      }
    };

    terminal.onData(handleData);

    return () => {
      terminal.offData(handleData);
    };
  }, [onCommandEnter]);

  const fit = useCallback(() => {
    const fitAddon = fitAddonRef.current;
    if (!fitAddon) return false;
    const success = fitAddon.fit();
    const terminal = xtermRef.current;
    if (success && terminal) {
      const { cols: c, rows: r } = terminal;
      setCols(c);
      setRows(r);
      onDimensionsReady?.(c, r);
    }
    return success;
  }, [onDimensionsReady]);

  const write = useCallback((data: string) => {
    xtermRef.current?.write(data);
  }, []);

  const writeln = useCallback((data: string) => {
    xtermRef.current?.writeln(data);
  }, []);

  const focus = useCallback(() => {
    xtermRef.current?.focus();
  }, []);

  const dispose = useCallback(() => {
    xtermRef.current?.dispose();
    xtermRef.current = null;
    fitAddonRef.current = null;
  }, []);

  return {
    terminalRef,
    xtermRef,
    fit,
    write,
    writeln,
    focus,
    dispose,
    cols,
    rows,
  };
}
