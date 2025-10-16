import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { MobNav } from "./competitions/MobNav";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-cover bg-top-[40px] bg-slate-950 text-white h-screen overflow-y-auto overflow-x-hidden">
      <div>
        <nav className="flex justify-between min-h-[100px] items-center mx-auto w-[85%]">
          <Link href={'/'}>
            <div className="flex gap-2 items-center relative max-md:hidden ">
              <Image
              src="/img/logo_icon.png"
              alt="logo"
              width={70}
              height={70}
              className="block max-md:hidden relative left-[-35px]"
              /> 
            <div className="absolute left-[25px]">
              <h1 className="font-semibold">Oprix&nbsp;CTF</h1>
              <p className="text-sm">african</p>
              </div>
            </div>
            <Image
              src="/img/logo_icon.png"
              alt="logo"
              width={70}
              height={70}
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
                <Link href="/">Home</Link>{" "}
              </li>
              <li>
                {" "}
                <Link className="text-slate-500" href="/competitions">
                  Competitions
                </Link>{" "}
              </li>
              <li>
                {" "}
                <Link className="text-slate-500" href="/about-us">
                  About us
                </Link>{" "}
              </li>
              <li>
                {" "}
                <Link className="text-slate-500" href="/faq">
                  FAQ
                </Link>{" "}
              </li>
            </ul>
            <div className="flex gap-2 *:cursor-pointer">
              <button className="p-1 rounded-full px-5 bg-gradient-to-tl from-slate-800 to-slate-900 border-slate-700 border">
                Login
              </button>
              <button className="p-1 rounded-full px-5 bg-gradient-to-tl from-blue-500 to-blue-700 border-slate-700 border flex gap-2 items-center">
                Signup <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </div>
      <footer className="py-10 pb-15 mt-10 text-center border-t border-blue-400/20 relative overflow-hidden bg-blue-600/3">
        <div className="bg-yellow-500 size-[50px] blur-3xl absolute bottom-[-40px] left-[40%]"></div>
        <div className="bg-indigo-500 size-[20px] h-[140px] blur-3xl absolute bottom-[10px] left-[10px]"></div>
        <p className="mb-5">Copyright &copy; 2025. designed by Snoaw</p>
      </footer>
    </div>
  );
}

export default layout;
