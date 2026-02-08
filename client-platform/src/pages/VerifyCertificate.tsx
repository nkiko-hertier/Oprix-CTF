import { Container } from '../components/Container';
import { NavLink } from '../components/NavLink';

export function VerifyCertificate() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-200">Oprix CTF</span>
            <span className="text-xs text-slate-400">Certificate Verification</span>
          </div>
          <nav className="flex items-center gap-3">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/competitions">Competitions</NavLink>
            <NavLink to="/auth">Sign In</NavLink>
          </nav>
        </Container>
      </header>
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
            <h1 className="text-3xl font-semibold">Verify a certificate</h1>
            <p className="mt-3 text-sm text-slate-400">
              Enter the certificate verification code to validate authenticity.
            </p>
            <input
              className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm"
              placeholder="OPRIX-CTF-2024-001234"
            />
            <button className="mt-4 w-full rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold">Verify</button>
          </div>
        </Container>
      </section>
    </div>
  );
}
