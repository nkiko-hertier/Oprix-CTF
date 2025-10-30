// Navigation links for the dashboard
export const Links = [
  {
    name: "Home",
    path: "/dashboard",
    icon: "🏠",
  },
  {
    name: "Competitions",
    path: "/dashboard",
    icon: "🏆",
  },
  {
    name: "Users",
    path: "/dashboard/users",
    icon: "👥",
    roles: ["admin"], // Only visible to admins
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: "⚙️",
  },
]
