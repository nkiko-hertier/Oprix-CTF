import { Container } from '../components/Container';
import { AppShell } from '../components/AppShell';

export function ChallengeDetail() {
  return (
    <AppShell>
      <Container className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-200">WEB</p>
            <h1 className="mt-2 text-3xl font-semibold">SQL Injection Basics</h1>
          </div>
          <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs text-brand-200">100 pts</span>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Challenge details</h2>
            <p className="mt-3 text-sm text-slate-300">
              Exploit the vulnerable login endpoint to retrieve the hidden flag. Use common SQL injection payloads.
            </p>
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              <p>Target: http://challenge.ctf.com:8080</p>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-200">Hints</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-400">
                <li>• Try UNION SELECT combinations.</li>
                <li>• Check for error-based injection vectors.</li>
              </ul>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Submit flag</h2>
            <p className="mt-2 text-sm text-slate-400">Flags are case-insensitive.</p>
            <input
              className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
              placeholder="flag{...}"
            />
            <button className="mt-4 w-full rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold">Submit</button>
            <p className="mt-4 text-xs text-slate-500">3 attempts remaining before cooldown.</p>
          </section>
        </div>
      </Container>
    </AppShell>
  );
}
