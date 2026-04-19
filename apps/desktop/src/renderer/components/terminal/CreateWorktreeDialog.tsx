import React, { useState } from 'react';
import type { TerminalWorktreeConfig, Task } from '../../../shared/types';

interface CreateWorktreeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  terminalId: string;
  projectPath: string;
  backlogTasks?: Task[];
  onWorktreeCreated?: (config: TerminalWorktreeConfig) => void;
}

export function CreateWorktreeDialog({
  open,
  onOpenChange,
  terminalId,
  projectPath,
  backlogTasks = [],
  onWorktreeCreated,
}: CreateWorktreeDialogProps) {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    onWorktreeCreated?.({
      name: name.trim(),
      worktreePath: `${projectPath}/../${name.trim()}`,
      branch: branch.trim() || undefined,
    });
    setName('');
    setBranch('');
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg border bg-card p-4 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Create Worktree</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border bg-background px-3 py-2 text-sm"
              placeholder="feature-branch"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Branch (optional)</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full rounded border bg-background px-3 py-2 text-sm"
              placeholder="main"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded px-3 py-1.5 text-sm hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
