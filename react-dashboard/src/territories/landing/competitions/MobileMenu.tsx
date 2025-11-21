"use client"

import React from "react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "../../../components/ui/sheet"
import { Button } from "../../../components/ui/button"
import { Link, Menu } from "lucide-react"

interface MobileMenuProps {
    scrollToSection: (id: string) => void
    activeSection: string
}

export function MobileMenu({ scrollToSection, activeSection }: MobileMenuProps) {
    const [open, setOpen] = React.useState(false)

    const handleClick = (id: string) => {
        scrollToSection(id)
        setTimeout(() => setOpen(false), 800)
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 md:hidden"
                    aria-label="Toggle menu"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="bg-[#100E19] border-l border-[#4e486a] text-white p-3 flex flex-col justify-between"
            >
                <SheetHeader>
                    <SheetTitle>
                        <div className="logo">
                            <img
                                src="/img/logo_icon.png"
                                alt="logo"
                                width={50}
                                height={50}
                                className="left-[-35px]"
                            />
                            <h1>Oprix CTF</h1>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-6 text-lg mt-8">
                    {[
                        { id: "home", label: "Home" },
                        { id: "howitworks", label: "How it Works" },
                        { id: "faq", label: "FAQ" },
                        { id: "contact", label: "Contact Us" },
                    ].map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleClick(link.id)}
                            className={`text-left transition-all duration-200 ${activeSection === link.id ? "text-white font-medium" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-10">
                <Link to={'/auth/sign-in'} className="bg-[#573BA8] px-6 py-3 rounded-full text-sm w-full">
                        Get Started
                    </Link>   
                </div>
            </SheetContent>
        </Sheet>
    )
}
