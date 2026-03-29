import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn('w-full rounded-md border border-slate-300 px-3 py-2 text-sm', 'focus:border-secondary focus:outline-none', className)}
      {...props}
    />
  );
});
