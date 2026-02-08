import { Activity, Flag, Shield, Users } from 'lucide-react';
import { Container } from '../components/Container';
import { StatCard } from '../components/StatCard';
import { AppShell } from '../components/AppShell';

export function Dashboard() {
  return (
    <AppShell>
      <Container className="py-10">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Welcome back</p>
          <h1 className="mt-3 text-3xl font-semibold">Your competition command center</h1>
          <p className="mt-3 text-sm text-slate-400">
            Track current events, manage teams, and monitor your challenge progress in real time.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Competitions" value="2" icon={Flag} trend="+1 new event" />
          <StatCard label="Team Members" value="4" icon={Users} trend="Captain assigned" />
          <StatCard label="Solved Challenges" value="18" icon={Shield} trend="+4 since yesterday" />
          <StatCard label="Total Points" value="920" icon={Activity} trend="Top 12%" />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Upcoming milestones</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3">
                <span>Summer CTF warm-up session</span>
                <span className="text-xs text-slate-500">Tomorrow</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3">
                <span>Team challenge briefing</span>
                <span className="text-xs text-slate-500">In 2 days</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3">
                <span>Scoreboard reveal</span>
                <span className="text-xs text-slate-500">July 3</span>
              </li>
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Quick actions</h2>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold">Join competition</button>
              <button className="w-full rounded-full border border-slate-700 px-4 py-3 text-sm">Create a team</button>
              <button className="w-full rounded-full border border-slate-700 px-4 py-3 text-sm">View certificates</button>
            </div>
          </section>
        </div>
      </Container>
    </AppShell>
  );
}
