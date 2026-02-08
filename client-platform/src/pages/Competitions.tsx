import { Calendar, Users } from 'lucide-react';
import { Container } from '../components/Container';
import { NavLink } from '../components/NavLink';

const competitions = [
  {
    id: 'summer-ctf',
    name: 'Summer CTF 2025',
    date: 'July 1 - July 3',
    teamBased: true,
    participants: 210
  },
  {
    id: 'night-hunt',
    name: 'Midnight Hunt',
    date: 'Aug 12 - Aug 15',
    teamBased: false,
    participants: 86
  },
  {
    id: 'blue-team',
    name: 'Blue Team League',
    date: 'Sep 5 - Sep 7',
    teamBased: true,
    participants: 143
  }
];

export function Competitions() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-200">Oprix CTF</span>
            <span className="text-xs text-slate-400">Competitions</span>
          </div>
          <nav className="flex items-center gap-3">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <NavLink to="/auth">Sign In</NavLink>
          </nav>
        </Container>
      </header>
      <section className="py-12">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Open competitions</h1>
              <p className="mt-2 text-sm text-slate-400">Browse active and upcoming CTF events.</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500"
                placeholder="Search competitions"
              />
              <button className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">Filters</button>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {competitions.map((competition) => (
              <article key={competition.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{competition.name}</h2>
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs text-brand-200">
                    {competition.teamBased ? 'Team-based' : 'Solo'}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-300" /> {competition.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-300" /> {competition.participants} participants
                  </span>
                </div>
                <div className="mt-6 flex gap-3">
                  <a
                    className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white"
                    href={`/competitions/${competition.id}`}
                  >
                    View details
                  </a>
                  <button className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-200">Join waitlist</button>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
