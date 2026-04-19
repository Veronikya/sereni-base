export function isWindows(): boolean {
  return navigator.platform.startsWith('Win');
}

export function isMac(): boolean {
  return navigator.platform.startsWith('Mac');
}

export function isLinux(): boolean {
  return navigator.platform.startsWith('Linux');
}
