import { Container } from '../components/Container';
import { AppShell } from '../components/AppShell';

export function Certificates() {
  return (
    <AppShell>
      <Container className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Certificates</h1>
            <p className="mt-2 text-sm text-slate-400">Request and download your completion certificates.</p>
          </div>
          <button className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white">Request certificate</button>
        </div>
        <div className="mt-8 space-y-4">
          {['Summer CTF 2024', 'Night Hunt 2024'].map((name) => (
            <div key={name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{name}</h2>
                  <p className="text-sm text-slate-400">Status: Issued</p>
                </div>
                <button className="rounded-full border border-slate-700 px-4 py-2 text-sm">Download PDF</button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </AppShell>
  );
}
