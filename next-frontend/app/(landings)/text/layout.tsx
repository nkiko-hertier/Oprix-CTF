import Link from "next/link";
import Image from "next/image";
import { BiSolidHomeSmile } from "react-icons/bi";
import { BsFillPeopleFill, BsLayoutSidebarReverse } from "react-icons/bs";
import { HiMiniPresentationChartLine } from "react-icons/hi2";
import { IoNotifications, IoSettings } from "react-icons/io5";
import { TbAwardFilled } from "react-icons/tb";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { GradientCard } from "@/app/components/HomeCards";
export default function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="h-screen bg-[#181d27] bg-background">
            <div className="flex">
                <aside className="h-screen w-1/3 md:w-1/4">
                    <GradientCard className="h-full p-2 rounded-none!">
                        <div className="logo flex p-4 items-center gap-2">
                            <Image
                                src="/img/logo2.png"
                                alt="logo"
                                width={30}
                                height={30}
                                className=""
                            />
                            <h1>Oprix CTF</h1>
                        </div>
                        <hr className="border-dashed shadow-2xl" />
                        <div className="links flex flex-col mt-10">
                            <h1 className="text-slate-600 text-sm mb-5 uppercase">Basic Links</h1>
                            {/* Active Link */}
                            <Link href={''} className="flex gap-2 items-center p-3 hover:bg-accent rounded-md group">
                            <div className="relative text-yellow-300">
                                <BiSolidHomeSmile size={23} />
                                <div className="size-7 bg-amber-200 blur-2xl absolute top-[-5px] left-[-5px]"></div>
                            </div>
                                <p>Home</p>
                            </Link>
                            <Link href={''} className="flex gap-2 items-center p-3 hover:bg-accent rounded-md group">
                                <TbAwardFilled size={23} />
                                <p>Competitons</p>
                            </Link>
                            <Link href={''} className="flex gap-2 items-center p-3 hover:bg-accent rounded-md group">
                                <HiMiniPresentationChartLine size={23} />
                                <p>Analytics</p>
                            </Link>
                            <Link href={''} className="flex gap-2 items-center p-3 hover:bg-accent rounded-md group">
                                <BsFillPeopleFill size={23} />
                                <p>Users</p>
                            </Link>
                            <Link href={''} className="flex gap-2 items-center p-3 hover:bg-accent rounded-md group">
                                <IoSettings size={23} />
                                <p>Settings</p>
                            </Link>
                        </div>
                    </GradientCard>
                </aside>
                <main className="w-full p-3">
                    <header className="min-h-15 w-full rounded-md">

                        <GradientCard className="min-h-fit! p-3 flex justify-between items-center px-5 rounded-md">
                            <div className="cursor-pointer">
                                <BsLayoutSidebarReverse />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hover:bg-accent p-2 cursor-pointer rounded-md relative">
                                    <IoNotifications size={20} />
                                    <span className="block bg-red-500 absolute top-[10px] right-[10px] border-2 border-sidebar size-2 rounded-2xl"></span>
                                </div>
                                <UserButton />
                            </div>
                        </GradientCard>
                    </header>
                    <div className="p-2">
                    {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
