import { useState, useEffect } from "react";
import { Sun, Moon, Bell } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignedIn } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import RequireAccess from "@/components/RequireAccess";

export default function DashboardLayout() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Apply theme class to body
  useEffect(() => {
    document.documentElement.classList.remove(
      theme === "light" ? "dark" : "light",
    );
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className="bg-sidebar min-h-screen text-foreground w-full">
      {/*  */}
      <nav className="bg-background">
            <div className="px-6 py-3 flex justify-between">
              <div>
                Oprix CTF
              </div>
                        <div className="flex items-center gap-2">
              
              <Button variant="ghost" onClick={toggleTheme}>
                <Bell />
              </Button>
              <Button variant="ghost" onClick={toggleTheme}>
                {theme === "light" ? <Moon /> : <Sun />}
              </Button>
              <SignedIn>
                <UserButton />
              </SignedIn>
                        </div>
            </div>
            <div className="px-6 border-t border-border">
              <ul className="flex gap-4 text-muted-foreground text-sm">
                <li>
                  <Link to="/" className="py-3 block border-b border-black dark:border-white text-white " >Competitions</Link>
                </li>
                <RequireAccess roles={['admin']}>
                  <li>
                    <Link to="/users" className="py-3 block " >Users</Link>
                  </li>
                </RequireAccess>
                <li>
                  <Link to="/settings" className="py-3 block " >Settings</Link>
                </li>
              </ul>
            </div>
        </nav>

      {/* Main Content */}
      <div className="w-full md:px-10">
        <main className="p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
