import { SignedOut, SignIn, SignUp } from "@clerk/clerk-react";


export default function Invitations() {
    return (
        <div>
       <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Accept to gain access the CTF platform
              </p>
            </div>
            <SignUp
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
            </div>
    );
}