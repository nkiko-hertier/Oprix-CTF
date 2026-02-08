import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

type NavLinkProps = PropsWithChildren<{ to: string }>;

export function NavLink({ to, children }: NavLinkProps) {
  return (
    <RouterLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'rounded-full px-4 py-2 text-sm font-medium transition',
          isActive ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-200 hover:text-white'
        )
      }
    >
      {children}
    </RouterLink>
  );
}
