import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

export function RequireAuth({ children }) {
  const { isSignedIn } = useUser();
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  return children;
}
