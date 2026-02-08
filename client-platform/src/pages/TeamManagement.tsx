import { Container } from '../components/Container';
import { AppShell } from '../components/AppShell';

export function TeamManagement() {
  return (
    <AppShell>
      <Container className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Team management</h1>
            <p className="mt-2 text-sm text-slate-400">Create or join a team for team-based events.</p>
          </div>
          <button className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white">Create team</button>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Invite teammates</h2>
            <p className="mt-2 text-sm text-slate-400">Share your invite code to add members.</p>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm">
              <span className="text-slate-200">OPRIX-TEAM-123</span>
              <button className="ml-auto rounded-full border border-slate-700 px-3 py-1 text-xs">Copy</button>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Join a team</h2>
            <p className="mt-2 text-sm text-slate-400">Enter an invite code to join.</p>
            <input className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm" placeholder="Invite code" />
            <button className="mt-4 w-full rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold">Join team</button>
          </section>
        </div>
      </Container>
    </AppShell>
  );
}
