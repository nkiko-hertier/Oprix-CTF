import { ClerkProvider } from '@clerk/clerk-react';
import type { PropsWithChildren } from 'react';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function AppClerkProvider({ children }: PropsWithChildren) {
  if (!publishableKey) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-glow">
            <h1 className="text-2xl font-semibold">Clerk key missing</h1>
            <p className="mt-3 text-sm text-slate-300">
              Add <span className="font-mono text-slate-100">VITE_CLERK_PUBLISHABLE_KEY</span> to enable authentication.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
