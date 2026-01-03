import { ArrowRight, Menu } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { MobNav } from "../competitions/MobNav.tsx";
import { useEffect } from "react"


import { SignIn, SignUpButton, SignInButton, SignedOut, SignedIn } from '@clerk/clerk-react'
import { FaBroom, FaFacebook, FaLinkedin } from "react-icons/fa";
import { GrTwitter } from "react-icons/gr";
import { TfiYoutube } from "react-icons/tfi";

function HomeLayout() {

  return (
    <div className="bg-cover bg-top-[40px] bg-slate-950 text-white h-screen overflow-y-auto overflow-x-hidden">
      <div>
        <nav className="flex justify-between min-h-[100px] items-center mx-auto w-[85%]">
          <Link to={'/'}>
            <div className="flex gap-2 items-center relative max-md:hidden ">
              <img
                src="/img/logo_icon.png"
                alt="logo"
                width={30}
                height={30}
                className="block max-md:hidden relative left-[-35px]"
              />
              <div className="absolute left-[25px]">
                <h1 className="font-semibold">InfoSec&nbsp;Giants</h1>
                <p className="text-sm">cyber online</p>
              </div>
            </div>
            <img
              src="/img/logo_icon.png"
              alt="logo"
              width={30}
              height={30}
              className="hidden max-md:block relative left-[-35px]"
            />
          </Link>
          <div className="lg:hidden">
            <MobNav />
          </div>
          <div className="lg:flex gap-20 hidden">
            <ul className="flex gap-5">
              <li>
                {" "}
                <Link className="cursor-target" to="/">Home</Link>{" "}
              </li>
              <li>
                {" "}
                <Link className="text-slate-500 cursor-target" to="/competitions">
                  Competitions
                </Link>{" "}
              </li>
              <li>
                {" "}
                <a className="text-slate-500 cursor-target" href="/#howitworks">
                  About us
                </a>{" "}
              </li>
              <li>
                {" "}
                <a className="text-slate-500 cursor-target" href="/#faq">
                  FAQ
                </a>{" "}
              </li>
            </ul>
            <div className="flex gap-2 *:cursor-pointer">
              <SignedOut>
                <SignInButton>
                  <button className="p-1 cursor-target rounded-full px-5 bg-gradient-to-tl from-slate-800 to-slate-900 border-slate-700 border">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="p-1 cursor-target rounded-full px-5 bg-gradient-to-tl from-blue-500 to-blue-700 border-slate-700 border flex gap-2 items-center">
                    Signup <ArrowRight size={17} />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link to={'/platform'}>
                  <button className="p-2 cursor-target group rounded-md px-5 bg-gradient-to-tl from-blue-500 to-blue-700 border-slate-700 border flex gap-2 items-center">
                    <FaBroom size={18} className="group-hover:rotate-[360deg]" />
                    Dashboard
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
      <footer className='bg-slate-600/10 min-h-[200px] mt-10 p-5'>
        <div className='grid md:grid-cols-2 md:w-[90%] mx-auto'>
          <div>
            <div className="logo flex gap-2 items-center">
              <img
                src="/img/logo_icon.png"
                alt="logo"
                width={30}
                height={30}
                className="block max-md:hidden left-[-35px]"
              />
              <p>InfoSec Giants</p>
            </div>
            <p className='md:w-[90%] mt-5 text-zinc-400'>InfoSec Giants is a cybersecurity platform where beginners and professionals sharpen their skills through hands-on Capture The Flag (CTF) challenges and real-world security competitions.</p>
            {/* Social Links */}
            <div className='flex gap-5 mt-5'>
              <Link to={'#'} className='bg-slate-800 p-3 rounded-full'>
                <FaLinkedin />
              </Link>
              <Link to={'#'} className='bg-slate-800 p-3 rounded-full'>
                <FaFacebook />
              </Link>
              <Link to={'#'} className='bg-slate-800 p-3 rounded-full'>
                <GrTwitter />
              </Link>
              <Link to={'#'} className='bg-slate-800 p-3 rounded-full'>
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
          <p>&copy; Copyright InfoSecGiants 2025. All Right reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomeLayout;
