import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Target, 
  UsersRound, 
  Send, 
  Award, 
  Megaphone, 
  Bell, 
  FileText,
  Moon,
  Sun,
  BadgeCheck,
  Book
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import { useUser, useIsSuperAdmin } from "@/lib/clerk-provider";
import { UserButton } from "@clerk/clerk-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    role: ['ADMIN', 'SUPERADMIN', 'CREATOR']
  },
  {
    title: "Competitions",
    url: "/competitions",
    icon: Trophy,
    role: ['ADMIN', 'SUPERADMIN']
  },
  {
    title: "Challenges",
    url: "/challenges",
    icon: Target,
    role: ['ADMIN', 'SUPERADMIN', 'CREATOR']
  },
  {
    title: "Learning",
    url: "/learning",
    icon: Book,
    role: ['SUPERADMIN']
  },
  // {
  //   title: "Teams",
  //   url: "/teams",
  //   icon: UsersRound,
  // },
  {
    title: "Certificates",
    url: "/certificates",
    icon: BadgeCheck,
    role: ['ADMIN', 'SUPERADMIN']
  },
  {
    title: "Submissions",
    url: "/submissions",
    icon: Send,
    role: ['ADMIN', 'SUPERADMIN']
  },
  {
    title: "Leaderboards",
    url: "/leaderboards",
    icon: Award,
    role: ['ADMIN', 'SUPERADMIN']
  },
  {
    title: "Announcements",
    url: "/announcements",
    icon: Megaphone,
    role: ['ADMIN', 'SUPERADMIN']
  },
  // {
  //   title: "Notifications",
  //   url: "/notifications",
  //   icon: Bell,
  // },
];

const superAdminItems = [
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Audit Logs",
    url: "/audit-logs",
    icon: FileText,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const isSuperAdmin = useIsSuperAdmin();

  // Handle dev mode without Clerk
  const userRole = (user?.publicMetadata?.role as string) || "SUPERADMIN";
  const userName = user?.fullName || user?.username || "Admin User";
  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.username?.substring(0, 2).toUpperCase() || "AU";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold px-4 py-3">
            CTF Admin
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-5">
            <SidebarMenu>
              {menuItems.map((item) => {
                if(!item.role.includes(userRole)) return;
                const isActive = location === item.url || (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={`nav-${item.title.toLowerCase()}`}>
                      <Link href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isSuperAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-4">SuperAdmin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {superAdminItems.map((item) => {
                  const isActive = location === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive} data-testid={`nav-${item.title.toLowerCase().replace(" ", "-")}`}>
                        <Link href={item.url}>
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <UserButton />
          <Avatar className="w-10 h-10 hidden">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground">
              {userName}
            </p>
            <Badge variant="secondary" className="text-xs mt-1">
              {userRole}
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full gap-2"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{theme === "dark" ? "Light" : "Dark"} Mode</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
