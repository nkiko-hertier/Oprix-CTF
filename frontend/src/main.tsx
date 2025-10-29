import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { shadcn } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import App from "./App.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/auth/signin"
      signUpUrl="/auth/signup"
      afterSignInUrl="/dashboard"
      appearance={{ baseTheme: shadcn }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
);
