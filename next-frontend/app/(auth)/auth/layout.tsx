'use client'
import BgSvg from "@/app/(landings)/competitions/BgSvg";
import { MobileMenu } from "@/app/(landings)/competitions/MobileMenu";
import { SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaLinkedin, FaFacebook } from "react-icons/fa";
import { GrTwitter } from "react-icons/gr";
import { TfiYoutube } from "react-icons/tfi";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const toggleMenu = () => setMenuOpen(!menuOpen)

  // Detect which section is in view (scroll spy)
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach(section => observer.observe(section))
    return () => sections.forEach(section => observer.unobserve(section))
  }, [])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setMenuOpen(false)
    }
  }
  return (
    <>
      <div className="">
        <div className='md:p-10 p-5 stickys top-0 z-30'>
          <nav className='min-h-[70px] backdrop-blur-sm bg-slate-600/10 borders rounded-full border-[#4e486a] px-5 flex justify-between items-center'>
            <div className="logo flex px-2 gap-2 items-center">
              <ArrowLeft size={20} />
              <Link href={'/'}>Back Home</Link>
            </div>
            <div className="links">
              <ul className='gap-10 items-center h-full hidden md:flexk'>
                {[
                  { id: "home", label: "Home" },
                  { id: "howitworks", label: "How it works" },
                  { id: "faq", label: "FAQ" },
                  { id: "contact", label: "Contact us" },
                ].map((link) => (
                  <li
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`cursor-pointer transition-colors duration-300 ${activeSection === link.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {link.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className='hidden md:block'>
              <SignedOut>
                <SignInButton>
                  <button className='bg-[#573BA8] p-3 px-7 rounded-full text-sm'>Get Started</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href={'/platform'} className='bg-[#573BA8] flex gap-2 p-3 px-7 items-center rounded-full text-sm'>Dashboard <ArrowRight size={15} /> </Link>
              </SignedIn>
            </div>
            <div className=' md:hidden'>
              <MobileMenu scrollToSection={scrollToSection} activeSection={activeSection} />
            </div>
          </nav>
        </div>
        <div className="mx-auto w-fit min-h-[500px] mt-15">
          {children}
        </div>
        {/* <BgSvg className="fixed opacity-80 right-0 -z-10 -top-2" />
        <BgSvg className="fixed opacity-80 left-0 scale-x-[-1] -z-10 -top-2" /> */}
        <footer className='bg-slate-600/10 min-h-[200px] mt-10 p-5'>
          <div className='grid md:grid-cols-2 md:w-[90%] mx-auto'>
            <div>
              <div className="logo flex gap-2 items-center">
                <Image
                  src="/img/logo_icon.png"
                  alt="logo"
                  width={30}
                  height={30}
                  className="block max-md:hidden left-[-35px]"
                />
                <p>Oprix CTF</p>
              </div>
              <p className='md:w-[90%] mt-5 text-zinc-400'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto, eos. Magnam totam, ipsam repellat eum earum iusto nemo laudantium amet vero natus voluptatem odio alias veritatis distinctio illum ea dignissimos.</p>
              {/* Social Links */}
              <div className='flex gap-5 mt-5'>
                <Link href={'#'} className='bg-slate-800 p-3 rounded-full'>
                  <FaLinkedin />
                </Link>
                <Link href={'#'} className='bg-slate-800 p-3 rounded-full'>
                  <FaFacebook />
                </Link>
                <Link href={'#'} className='bg-slate-800 p-3 rounded-full'>
                  <GrTwitter />
                </Link>
                <Link href={'#'} className='bg-slate-800 p-3 rounded-full'>
                  <TfiYoutube />
                </Link>
              </div>
            </div>
            <div className="links">
              <ul className='flex gap-5 items-start mt-10 md:justify-end h-full'>
                <li><a href="#">Home</a></li>
                <li><a href="#">How it works</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Contact us</a></li>
              </ul>
            </div>
          </div>
          <div className='mt-10 md:w-[90%] mx-auto'>
            <p>&copy; Copyright Oprix 2025. All Right reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default layout;
