import { Container } from '../components/Container';
import { AppShell } from '../components/AppShell';

export function MyCompetitions() {
  return (
    <AppShell>
      <Container className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">My competitions</h1>
            <p className="mt-2 text-sm text-slate-400">Stay on top of active and upcoming competitions.</p>
          </div>
          <button className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white">Join new event</button>
        </div>
        <div className="mt-8 grid gap-4">
          {['Summer CTF 2025', 'Night Hunt League'].map((name) => (
            <div key={name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{name}</h2>
                  <p className="text-sm text-slate-400">Status: Active</p>
                </div>
                <button className="rounded-full border border-slate-700 px-4 py-2 text-sm">Open hub</button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </AppShell>
  );
}
