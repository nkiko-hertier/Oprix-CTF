import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bird, Menu } from "lucide-react";

import { Links } from "@/lib/links";
import { Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2 mb-8">
              <Bird className="text-indigo-500" />
              <h1 className="font-bold text-xl text-indigo-500">Oprix</h1>
            </div>
          </SheetTitle>
          <SheetDescription>
            Here you can see more info about this competition.
          </SheetDescription>
        </SheetHeader>
        <div className="flex p-4 flex-col justify-between h-full">
          <nav className="flex-1">
            <h2 className="text-sm text-zinc-500 mb-2  ">OVERVIEW</h2>
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
                        <span className="">{link.label}</span>
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>
          </nav>
          <div className="mt-5">
            <h2 className="text-sm text-zinc-500 mb-2  ">SETTINGS</h2>
            <div>
              <Link
                to="/settings"
                className="flex items-center gap-2 py-2 px-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
              >
                <Settings size={17} />
                <span className="">Settings</span>
              </Link>

              <Link
                to="/settings"
                className="flex items-center gap-2 py-2 px-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
              >
                <LogOut size={17} />
                <span className="">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
