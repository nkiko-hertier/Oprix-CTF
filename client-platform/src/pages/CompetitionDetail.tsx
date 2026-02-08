import { useParams } from 'react-router-dom';
import { Calendar, Flag, Users } from 'lucide-react';
import { Container } from '../components/Container';
import { NavLink } from '../components/NavLink';

export function CompetitionDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-200">Oprix CTF</span>
            <span className="text-xs text-slate-400">Competition</span>
          </div>
          <nav className="flex items-center gap-3">
            <NavLink to="/competitions">Competitions</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <NavLink to="/auth">Sign In</NavLink>
          </nav>
        </Container>
      </header>

      <section className="py-12">
        <Container>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">{id}</p>
          <h1 className="mt-3 text-3xl font-semibold">Summer CTF 2025</h1>
          <p className="mt-4 text-sm text-slate-300">
            Compete in a multi-category event featuring web, crypto, and reverse engineering challenges.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Calendar, label: 'Schedule', value: 'July 1 - July 3' },
              { icon: Users, label: 'Participants', value: '210 registered' },
              { icon: Flag, label: 'Mode', value: 'Team-based' }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-brand-500/10 p-2 text-brand-300">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-base font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-lg font-semibold">Competition overview</h2>
              <p className="mt-3 text-sm text-slate-300">
                Build your team, solve challenges across multiple tracks, and climb the leaderboard. Registration
                closes 24 hours before the event begins. Solo registrations are enabled if teams are full.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>• 48-hour live challenge window</li>
                <li>• Real-time leaderboard with challenge unlocks</li>
                <li>• Certificates for top 30% finishers</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-base font-semibold">Join now</h3>
              <p className="mt-2 text-sm text-slate-400">Choose team or solo participation.</p>
              <div className="mt-5 space-y-3">
                <button className="w-full rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Join as team</button>
                <button className="w-full rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">Join solo</button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
