import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <article className={cn('rounded-xl border border-slate-200 bg-white p-6 shadow-sm', className)}>{children}</article>;
}
