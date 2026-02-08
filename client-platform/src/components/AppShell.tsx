import type { PropsWithChildren } from 'react';
import { NavLink } from './NavLink';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-200">Oprix CTF</span>
            <span className="text-xs text-slate-400">Client Platform</span>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/app">Dashboard</NavLink>
            <NavLink to="/app/competitions">Competitions</NavLink>
            <NavLink to="/app/leaderboard">Leaderboard</NavLink>
            <NavLink to="/app/certificates">Certificates</NavLink>
          </nav>
        </div>
      </header>
      <main className="pb-16">{children}</main>
    </div>
  );
}
