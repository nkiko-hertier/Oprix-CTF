import { useState, useEffect } from "react";
import { Links } from "@/lib/links";
import { Bird, Sun, Moon, Bell, Settings, LogOut } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignedIn } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import { MobileMenu } from "@/components/MobileMenu";

export default function DashboardLayout() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Apply theme class to body
  useEffect(() => {
    document.documentElement.classList.remove(
      theme === "light" ? "dark" : "light",
    );
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className="flex h-screen bg-background dark:bg-sidebar text-foreground w-full">
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col justify-between w-fit lg:w-1/4 p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Bird className="text-indigo-500" />
          <h1 className="font-bold text-xl text-indigo-500 hidden lg:block">
            Oprix
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col justify-between h-full">
          <nav className="flex-1">
            <h2 className="text-sm text-zinc-500 mb-2 hidden lg:block ">
              OVERVIEW
            </h2>
            <ul className="space-y-1">
              {Links.map((link, i) => {
                if (link.role === "student") {
                  return (
                    <li key={i}>
                      <Link
                        to={link.path}
                        className="flex items-center gap-2 py-2 px-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                      >
                        {link.icon}
                        <span className="hidden lg:block">{link.label}</span>
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>
          </nav>
          <div className="mt-5">
            <h2 className="text-sm text-zinc-500 mb-2 hidden lg:block ">
              SETTINGS
            </h2>
            <div>
              <Link
                to="/settings"
                className="flex items-center gap-2 py-2 px-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
              >
                <Settings size={17} />
                <span className="hidden lg:block">Settings</span>
              </Link>

              <Link
                to="/settings"
                className="flex items-center gap-2 py-2 px-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
              >
                <LogOut size={17} />
                <span className="hidden lg:block">Logout</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
      </aside>

      {/* Main Content */}
      <div className="h-screen w-full">
        <nav className=" px-6 py-3 flex justify-between">
          <MobileMenu />
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
        </nav>
        <main className="flex-1 h-full rounded-2xl p-5 overflow-auto bg-sidebar dark:bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
