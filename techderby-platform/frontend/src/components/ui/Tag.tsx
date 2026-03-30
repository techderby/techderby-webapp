import type { ReactNode } from 'react';

export function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">{children}</span>;
}
