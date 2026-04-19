import React, { useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ContextMenuState } from './useTerminalContextMenu';

interface LineInsertContextMenuProps {
  contextMenu: ContextMenuState;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onInsertAbove: () => void;
  onInsertBelow: () => void;
}

export function LineInsertContextMenu({
  contextMenu,
  menuRef,
  onInsertAbove,
  onInsertBelow,
}: LineInsertContextMenuProps) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Focus first item when menu opens
  useEffect(() => {
    itemRefs.current[0]?.focus();
  }, [contextMenu]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = itemRefs.current[index + 1] ?? itemRefs.current[0];
      next?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = itemRefs.current[index - 1] ?? itemRefs.current[itemRefs.current.length - 1];
      prev?.focus();
    }
  };

  return (
    <div
      ref={menuRef}
      className={cn(
        'fixed z-[100] min-w-[180px] overflow-hidden rounded-md',
        'border border-border/50 bg-popover shadow-md',
        'animate-in fade-in-0 zoom-in-95 duration-75'
      )}
      style={{ left: contextMenu.x, top: contextMenu.y }}
      role="menu"
    >
      <button
        ref={(el) => { itemRefs.current[0] = el; }}
        className={cn(
          'flex w-full items-center gap-2.5 px-3 py-2 text-sm',
          'text-left text-foreground transition-colors',
          'hover:bg-accent focus:bg-accent focus:outline-none'
        )}
        onClick={() => { onInsertAbove(); }}
        onKeyDown={(e) => handleKeyDown(e, 0, onInsertAbove)}
        role="menuitem"
      >
        <ArrowUp className="h-4 w-4 text-muted-foreground" />
        <span>向上插入空行</span>
        <kbd className="ml-auto text-[10px] text-muted-foreground">↑</kbd>
      </button>

      <div className="h-px bg-border/50" />

      <button
        ref={(el) => { itemRefs.current[1] = el; }}
        className={cn(
          'flex w-full items-center gap-2.5 px-3 py-2 text-sm',
          'text-left text-foreground transition-colors',
          'hover:bg-accent focus:bg-accent focus:outline-none'
        )}
        onClick={() => { onInsertBelow(); }}
        onKeyDown={(e) => handleKeyDown(e, 1, onInsertBelow)}
        role="menuitem"
      >
        <ArrowDown className="h-4 w-4 text-muted-foreground" />
        <span>向下插入空行</span>
        <kbd className="ml-auto text-[10px] text-muted-foreground">↓</kbd>
      </button>
    </div>
  );
}
