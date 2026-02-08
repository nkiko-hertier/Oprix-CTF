import { Container } from '../components/Container';
import { AppShell } from '../components/AppShell';

export function Submissions() {
  return (
    <AppShell>
      <Container className="py-10">
        <h1 className="text-3xl font-semibold">Submissions</h1>
        <p className="mt-2 text-sm text-slate-400">Review flag submissions and statuses.</p>
        <div className="mt-8 space-y-3">
          {['SQL Injection Basics', 'Crypto Trail'].map((title) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-slate-500">Submitted 2 hours ago</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">Correct</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </AppShell>
  );
}
