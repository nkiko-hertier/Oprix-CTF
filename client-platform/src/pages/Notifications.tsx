import { Container } from '../components/Container';
import { AppShell } from '../components/AppShell';

export function Notifications() {
  return (
    <AppShell>
      <Container className="py-10">
        <h1 className="text-3xl font-semibold">Notifications</h1>
        <p className="mt-2 text-sm text-slate-400">Stay informed about announcements and updates.</p>
        <div className="mt-8 space-y-3">
          {['New challenge pack released', 'Leaderboard updated', 'Team invite accepted'].map((note) => (
            <div key={note} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-sm font-semibold">{note}</p>
              <p className="text-xs text-slate-500">Just now</p>
            </div>
          ))}
        </div>
      </Container>
    </AppShell>
  );
}
