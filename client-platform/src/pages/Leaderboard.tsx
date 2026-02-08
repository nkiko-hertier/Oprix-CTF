import { Container } from '../components/Container';
import { NavLink } from '../components/NavLink';

export function Leaderboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-200">Oprix CTF</span>
            <span className="text-xs text-slate-400">Leaderboard</span>
          </div>
          <nav className="flex items-center gap-3">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/competitions">Competitions</NavLink>
            <NavLink to="/auth">Sign In</NavLink>
          </nav>
        </Container>
      </header>
      <section className="py-12">
        <Container>
          <h1 className="text-3xl font-semibold">Global leaderboard</h1>
          <p className="mt-2 text-sm text-slate-400">Updated every 30 seconds.</p>
          <div className="mt-8 space-y-3">
            {['Team Nova', 'Cyber Ninjas', 'Root Hunters'].map((team, index) => (
              <div key={team} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-brand-200">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold">{team}</p>
                    <p className="text-xs text-slate-500">{980 - index * 120} pts</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{12 - index} solves</span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
