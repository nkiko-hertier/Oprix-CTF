'use client'

import { Link } from "react-router-dom"
import { BiSolidHomeSmile } from "react-icons/bi"
import { TbAwardFilled } from "react-icons/tb"
import { HiMiniPresentationChartLine } from "react-icons/hi2"
import { BsFillPeopleFill } from "react-icons/bs"
import { IoSettings } from "react-icons/io5"
import { useLocation } from "react-router-dom"

export default function SidebarLinks() {
  const location = useLocation();
  const pathname = location.pathname;

  const links = [
    { label: "Home", href: "/dashboard", icon: <BiSolidHomeSmile size={23} />},
    { label: "Competitions", href: "/dashboard/competitions", icon: <TbAwardFilled size={23} /> },
    { label: "Users", href: "/dashboard/users", icon: <BsFillPeopleFill size={23} /> },
    { label: "Submissions", href: "/dashboard/submissions", icon: <HiMiniPresentationChartLine size={23} /> },
  ]

  return (
    <div className="links flex flex-col mt-10">
      <h1 className="text-slate-600 text-sm mb-5 uppercase">Basic Links</h1>

      {links.map((link) => {
        const isActive = pathname === link.href

        return (
          <Link
            key={link.label}
            to={link.href}
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
