import { Container } from '../components/Container';
import { AppShell } from '../components/AppShell';

export function Settings() {
  return (
    <AppShell>
      <Container className="py-10">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your profile and preferences.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Profile</h2>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm" placeholder="Display name" />
              <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm" placeholder="Username" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="mt-2 text-sm text-slate-400">Update your authentication preferences.</p>
            <button className="mt-4 rounded-full border border-slate-700 px-4 py-2 text-sm">Manage sessions</button>
          </div>
        </div>
      </Container>
    </AppShell>
  );
}
