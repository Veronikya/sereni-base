import { create } from 'zustand';
import type { TerminalWorktreeConfig } from '../../shared/types';

export type TerminalStatus = 'idle' | 'running' | 'claude-active' | 'exited';

export interface TerminalState {
  id: string;
  title: string;
  cwd?: string;
  status: TerminalStatus;
  isCLIMode: boolean;
  isClaudeBusy?: boolean;
  pendingCLIResume?: boolean;
  associatedTaskId?: string;
  worktreeConfig?: TerminalWorktreeConfig;
}

interface TerminalStore {
  terminals: TerminalState[];
  addTerminal: (terminal: TerminalState) => void;
  removeTerminal: (id: string) => void;
  updateTerminal: (id: string, updates: Partial<TerminalState>) => void;
  setCLIMode: (id: string, isCLIMode: boolean) => void;
  setAssociatedTask: (id: string, taskId: string | undefined) => void;
  setWorktreeConfig: (id: string, config: TerminalWorktreeConfig | undefined) => void;
  setPendingClaudeResume: (id: string, pending: boolean) => void;
  resumeAllPendingClaude: () => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  terminals: [],
  addTerminal: (terminal) =>
    set((state) => ({ terminals: [...state.terminals, terminal] })),
  removeTerminal: (id) =>
    set((state) => ({
      terminals: state.terminals.filter((t) => t.id !== id),
    })),
  updateTerminal: (id, updates) =>
    set((state) => ({
      terminals: state.terminals.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),
  setCLIMode: (id, isCLIMode) =>
    set((state) => ({
      terminals: state.terminals.map((t) =>
        t.id === id ? { ...t, isCLIMode } : t
      ),
    })),
  setAssociatedTask: (id, taskId) =>
    set((state) => ({
      terminals: state.terminals.map((t) =>
        t.id === id ? { ...t, associatedTaskId: taskId } : t
      ),
    })),
  setWorktreeConfig: (id, config) =>
    set((state) => ({
      terminals: state.terminals.map((t) =>
        t.id === id ? { ...t, worktreeConfig: config } : t
      ),
    })),
  setPendingClaudeResume: (id, pending) =>
    set((state) => ({
      terminals: state.terminals.map((t) =>
        t.id === id ? { ...t, pendingCLIResume: pending } : t
      ),
    })),
  resumeAllPendingClaude: () =>
    set((state) => ({
      terminals: state.terminals.map((t) =>
        t.pendingCLIResume ? { ...t, pendingCLIResume: false } : t
      ),
    })),
}));
