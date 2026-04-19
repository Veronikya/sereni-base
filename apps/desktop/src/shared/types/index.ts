export interface TerminalWorktreeConfig {
  name: string;
  worktreePath: string;
  branch?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type ExecutionPhase =
  | 'idle'
  | 'planning'
  | 'coding'
  | 'rate_limit_paused'
  | 'auth_failure_paused'
  | 'qa_review'
  | 'qa_fixing'
  | 'complete'
  | 'failed';
