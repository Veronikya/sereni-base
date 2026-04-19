const DEBUG = process.env.NODE_ENV !== 'production';

export function debugLog(...args: unknown[]): void {
  if (DEBUG) {
    console.log('[Terminal]', ...args);
  }
}
