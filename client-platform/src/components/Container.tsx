import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

type ContainerProps = PropsWithChildren<{ className?: string }>;

export function Container({ className, children }: ContainerProps) {
  return <div className={clsx('mx-auto w-full max-w-6xl px-6', className)}>{children}</div>;
}
