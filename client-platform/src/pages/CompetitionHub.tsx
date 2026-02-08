import { Container } from '../components/Container';
import { AppShell } from '../components/AppShell';

export function CompetitionHub() {
  return (
    <AppShell>
      <Container className="py-10">
        <h1 className="text-3xl font-semibold">Competition hub</h1>
        <p className="mt-3 text-sm text-slate-400">Announcements, progress, and key links for your active event.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Latest announcements</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-slate-800 px-4 py-3">Challenge set updated with 6 new web tasks.</li>
              <li className="rounded-xl border border-slate-800 px-4 py-3">Live Q&A session starting in 2 hours.</li>
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Your progress</h2>
            <p className="mt-3 text-sm text-slate-300">12/48 challenges solved • 920 pts</p>
            <button className="mt-5 w-full rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
              Jump to challenges
            </button>
          </section>
        </div>
      </Container>
    </AppShell>
  );
}
