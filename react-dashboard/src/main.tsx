import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import { shadcn } from "@clerk/themes";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      appearance={{ baseTheme: shadcn }}
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/auth/sign-in"     // <-- your login page
      signUpUrl="/auth/sign-up"    // <-- your signup page
      afterSignInUrl="/onboard"  // <-- redirect after login
      afterSignUpUrl="/onboard"    // <-- redirect after signup
      >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
