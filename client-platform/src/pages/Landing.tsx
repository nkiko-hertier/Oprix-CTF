import { ArrowRight, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { Container } from '../components/Container';
import { NavLink } from '../components/NavLink';

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-200">Oprix CTF</span>
            <span className="text-xs text-slate-400">Client Platform</span>
          </div>
          <nav className="flex items-center gap-3">
            <NavLink to="/competitions">Competitions</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <NavLink to="/auth">Sign In</NavLink>
          </nav>
        </Container>
      </header>

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_65%)]" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Oprix CTF Season</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                Compete. Collaborate. Conquer.
              </h1>
              <p className="mt-6 text-lg text-slate-300">
                A full-stack CTF platform with live competitions, team management, and real-time leaderboards.
                Join global events, sharpen skills, and earn verifiable certificates.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-400"
                  href="/competitions"
                >
                  Explore competitions <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-slate-500"
                  href="/auth"
                >
                  Sign in
                </a>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Global Players', value: '8.2k+' },
                  { label: 'CTF Events', value: '120+' },
                  { label: 'Live Challenges', value: '2.4k+' }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[ShieldCheck, Trophy, Sparkles].map((Icon, index) => (
                <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-brand-500/10 p-3 text-brand-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base font-semibold">{index === 0 ? 'Secure Competition' : index === 1 ? 'Ranked Leaderboards' : 'Verified Certificates'}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {index === 0
                          ? 'Play with confidence using verified auth and anti-abuse submissions.'
                          : index === 1
                          ? 'Track your progress with real-time scoring and standings.'
                          : 'Request completion certificates when the event ends.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
