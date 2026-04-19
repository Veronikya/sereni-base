import { useState, useCallback, useRef, useEffect } from 'react';

export interface ContextMenuState {
  x: number;
  y: number;
  cursorRow: number;
}

interface UseTerminalContextMenuReturn {
  contextMenu: ContextMenuState | null;
  handleContextMenu: (e: React.MouseEvent, cursorRow: number) => void;
  closeContextMenu: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Manages terminal right-click context menu state.
 * Prevents browser default context menu and tracks click position.
 */
export function useTerminalContextMenu(): UseTerminalContextMenuReturn {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent, cursorRow: number) => {
    e.preventDefault();
    e.stopPropagation();

    const menuWidth = 200;
    const menuHeight = 80;
    let x = e.clientX;
    let y = e.clientY;

    // Adjust position to keep menu within viewport
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 8;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 8;
    }

    setContextMenu({ x, y, cursorRow });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!contextMenu) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    // Close on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu]);

  return { contextMenu, handleContextMenu, closeContextMenu, menuRef };
}
