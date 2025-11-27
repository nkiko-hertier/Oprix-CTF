import {
  ClerkProvider as BaseClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  useUser as useClerkUser,
} from "@clerk/clerk-react";
import { useEffect, createContext, useContext } from "react";
import { useLocation } from "wouter";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Mock user context for development mode
const DevUserContext = createContext<any>(null);

const mockDevUser = {
  id: "dev-user-1",
  username: "admin",
  firstName: "Admin",
  lastName: "User",
  fullName: "Admin User",
  imageUrl: undefined,
  publicMetadata: {
    role: "ADMIN",
  },
};

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  // If no Clerk key is provided, bypass authentication for development
  if (
    !CLERK_PUBLISHABLE_KEY ||
    CLERK_PUBLISHABLE_KEY === "pk_test_placeholder"
  ) {
    return <DevModeWrapper>{children}</DevModeWrapper>;
  }

  return (
    <BaseClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkAuthWrapper>{children}</ClerkAuthWrapper>
    </BaseClerkProvider>
  );
}

// Development mode wrapper that bypasses Clerk authentication
function DevModeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DevUserContext.Provider
      value={{ user: mockDevUser, isLoaded: true, isSignedIn: true }}
    >
      {children}
    </DevUserContext.Provider>
  );
}

// Custom useUser hook that works in both Clerk mode and dev mode
export function useUser() {
  if (
    !CLERK_PUBLISHABLE_KEY ||
    CLERK_PUBLISHABLE_KEY === "pk_test_placeholder"
  ) {
    const context = useContext(DevUserContext);
    return context || { user: mockDevUser, isLoaded: true, isSignedIn: true };
  }
  return useClerkUser();
}

function ClerkAuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Sign in to access the CTF platform
              </p>
            </div>
            <SignIn
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-lg",
                },
              }}
            />
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <RoleCheck>{children}</RoleCheck>
      </SignedIn>
    </>
  );
}

function RoleCheck({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      const role = user.publicMetadata?.role as string;
      if (!role || (role !== "ADMIN" && role !== "SUPERADMIN")) {
        console.warn("User does not have admin access");
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}

export function useUserRole(): "ADMIN" | "SUPERADMIN" | "USER" | null {
  // In dev mode without Clerk, default to SUPERADMIN for testing
  if (
    !CLERK_PUBLISHABLE_KEY ||
    CLERK_PUBLISHABLE_KEY === "pk_test_placeholder"
  ) {
    return "SUPERADMIN";
  }

  const { user } = useUser();
  return (
    (user?.publicMetadata?.role as "ADMIN" | "SUPERADMIN" | "USER") || null
  );
}

export function useIsAdmin(): boolean {
  const role = useUserRole();
  return role === "ADMIN" || role === "SUPERADMIN";
}

export function useIsSuperAdmin(): boolean {
  const role = useUserRole();
  return role === "SUPERADMIN";
}
