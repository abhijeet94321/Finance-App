
'use client';

import { useMemo } from 'react';

/**
 * A hook to stabilize Firebase references/queries for use in other hooks.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
