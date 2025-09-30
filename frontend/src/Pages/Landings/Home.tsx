import { SignInButton } from "@clerk/clerk-react";
import { Feather } from "lucide-react";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Feather />
      <SignInButton />
    </div>
  );
}
