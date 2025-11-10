'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BiSolidHomeSmile } from "react-icons/bi"
import { TbAwardFilled } from "react-icons/tb"
import { HiMiniPresentationChartLine } from "react-icons/hi2"
import { BsFillPeopleFill } from "react-icons/bs"
import { IoSettings } from "react-icons/io5"

export default function SidebarLinks() {
  const pathname = usePathname()

  const links = [
    { label: "Home", href: "/admin", icon: <BiSolidHomeSmile size={23} />},
    { label: "Competitions", href: "/admin/competitions", icon: <TbAwardFilled size={23} /> },
    { label: "Analytics", href: "/admin/analytics", icon: <HiMiniPresentationChartLine size={23} /> },
    { label: "Users", href: "/admin/users", icon: <BsFillPeopleFill size={23} /> },
    { label: "Settings", href: "/admin/settings", icon: <IoSettings size={23} /> },
  ]

  return (
    <div className="links flex flex-col mt-10">
      <h1 className="text-slate-600 text-sm mb-5 uppercase">Basic Links</h1>

      {links.map((link) => {
        const isActive = pathname === link.href

        return (
          <Link
            key={link.label}
            href={link.href}
            className={`flex gap-2 items-center p-3 rounded-md transition-all duration-200
              ${isActive ? "bg-accent text-yellow-300" : "hover:bg-accent text-slate-200"}
            `}
          >
            <div className={`relative`}>
              {link.icon}
              {isActive && (
                <div className="size-7 bg-amber-200 blur-2xl absolute top-[-5px] left-[-5px]"></div>
              )}
            </div>
            <p>{link.label}</p>
          </Link>
        )
      })}
    </div>
  )
}
