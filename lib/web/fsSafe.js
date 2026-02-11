/**
 * Safe path helpers for the web UI.
 * Prevents directory traversal outside the configured outputDir.
 */

import path from 'path';

export function resolveInside(baseDir, userPath) {
  const base = path.resolve(baseDir);
  const target = path.resolve(baseDir, userPath);
  if (target === base) return target;
  if (!target.startsWith(base + path.sep)) {
    const e = new Error('Invalid path');
    e.name = 'ProtoForgePathError';
    throw e;
  }
  return target;
}

export function normalizeRel(userPath) {
  const p = String(userPath || '').replace(/\\/g, '/');
  // strip leading slashes
  return p.replace(/^\/+/, '');
}
