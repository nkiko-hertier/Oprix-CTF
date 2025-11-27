import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@/lib/clerk-provider";
import { ThemeProvider } from "@/lib/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

// Pages
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";
import Competitions from "@/pages/competitions";
import Challenges from "@/pages/challenges";
import Teams from "@/pages/teams";
import Submissions from "@/pages/submissions";
import Leaderboards from "@/pages/leaderboards";
import Announcements from "@/pages/announcements";
import Notifications from "@/pages/notifications";
import AuditLogs from "@/pages/audit-logs";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/users" component={Users} />
      <Route path="/competitions" component={Competitions} />
      <Route path="/challenges" component={Challenges} />
      <Route path="/teams" component={Teams} />
      <Route path="/submissions" component={Submissions} />
      <Route path="/leaderboards" component={Leaderboards} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/audit-logs" component={AuditLogs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <ClerkProvider>
          <TooltipProvider>
            <SidebarProvider style={style as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <header className="flex items-center gap-2 border-b border-border bg-background px-6 py-3 sticky top-0 z-10">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                  </header>
                  <main className="flex-1 overflow-auto bg-background">
                    <div className="container max-w-[1400px] mx-auto px-6 py-8">
                      <Router />
                    </div>
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </ClerkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
