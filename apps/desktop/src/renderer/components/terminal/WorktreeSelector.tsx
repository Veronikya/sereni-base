import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { TerminalWorktreeConfig } from '../../../shared/types';

interface WorktreeSelectorProps {
  terminalId: string;
  projectPath: string;
  currentWorktree?: TerminalWorktreeConfig;
  onCreateWorktree?: () => void;
  onSelectWorktree?: (config: TerminalWorktreeConfig) => void;
}

export function WorktreeSelector({
  terminalId,
  projectPath,
  currentWorktree,
  onCreateWorktree,
  onSelectWorktree,
}: WorktreeSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(!open)}
      >
        <Plus className="h-3 w-3" />
        <span>Worktree</span>
        <ChevronDown className="h-3 w-3" />
      </Button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md border bg-popover p-1 shadow-lg">
          <button
            className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
            onClick={() => {
              onCreateWorktree?.();
              setOpen(false);
            }}
          >
            New worktree...
          </button>
        </div>
      )}
    </div>
  );
}
