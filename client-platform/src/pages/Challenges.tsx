import { Container } from '../components/Container';
import { AppShell } from '../components/AppShell';

export function Challenges() {
  return (
    <AppShell>
      <Container className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Challenges</h1>
            <p className="mt-2 text-sm text-slate-400">Filter by category, difficulty, and status.</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-full border border-slate-700 px-4 py-2 text-sm">Categories</button>
            <button className="rounded-full border border-slate-700 px-4 py-2 text-sm">Difficulty</button>
          </div>
        </div>
        <div className="mt-8 grid gap-4">
          {['SQL Injection Basics', 'Reverse the Hash', 'Crypto Trail'].map((title) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="text-sm text-slate-400">WEB • 100 pts • Easy</p>
                </div>
                <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold">Open</button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </AppShell>
  );
}
