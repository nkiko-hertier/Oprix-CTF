// src/config/links.ts
import {
  Home,
  Trophy,
  Layers,
  Users,
  ShieldCheck,
  Settings,
  BarChart3,
  UserCheck,
  FileText,
} from "lucide-react";

export interface LinkItem {
  label: string;
  path: string;
  icon: JSX.Element;
  role: "hoster" | "admin" | "student";
}

export const Links: LinkItem[] = [
  // Common / Public
  {
    label: "Home",
    path: "/",
    icon: <Home size={18} />,
    role: "student",
  },
  {
    label: "Competitions",
    path: "/competitions",
    icon: <Trophy size={18} />,
    role: "student",
  },
  {
    label: "Challenges",
    path: "/challenges",
    icon: <Layers size={18} />,
    role: "student",
  },
  {
    label: "Scoreboard",
    path: "/scoreboard",
    icon: <BarChart3 size={18} />,
    role: "student",
  },

  // Hoster (people who launch competitions)
  {
    label: "Host Dashboard",
    path: "/hoster/dashboard",
    icon: <ShieldCheck size={18} />,
    role: "hoster",
  },
  {
    label: "My Competitions",
    path: "/hoster/competitions",
    icon: <Trophy size={18} />,
    role: "hoster",
  },
  {
    label: "Manage Challenges",
    path: "/hoster/challenges",
    icon: <Layers size={18} />,
    role: "hoster",
  },

  // Admin
  {
    label: "Admin Dashboard",
    path: "/admin/dashboard",
    icon: <ShieldCheck size={18} />,
    role: "admin",
  },
  {
    label: "User Management",
    path: "/admin/users",
    icon: <Users size={18} />,
    role: "admin",
  },
  {
    label: "Competition Approvals",
    path: "/admin/approvals",
    icon: <UserCheck size={18} />,
    role: "admin",
  },
  {
    label: "System Logs",
    path: "/admin/logs",
    icon: <FileText size={18} />,
    role: "admin",
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: <Settings size={18} />,
    role: "admin",
  },
];
