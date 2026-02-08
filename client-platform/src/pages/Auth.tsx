import { SignIn } from '@clerk/clerk-react';
import { Container } from '../components/Container';

export function Auth() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Container className="flex min-h-screen items-center justify-center py-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 shadow-lg">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to access your competition dashboard.</p>
          <div className="mt-6">
            <SignIn routing="hash" />
          </div>
        </div>
      </Container>
    </div>
  );
}
