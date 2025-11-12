import Image from "next/image";
import { BsLayoutSidebarReverse } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";
import { GradientCard } from "@/app/components/HomeCards";
import SidebarLinks from "./components/SideBarLinks";
import { MdAddModerator } from "react-icons/md";
import CTFCompetitionForm from "./components/Models/CompetitionsForm";
import { Toaster } from "sonner";
export default function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="h-screen bg-[#181d27] bg-background">
            <Toaster />
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
                            <SidebarLinks />
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
                                <CTFCompetitionForm>
                                <div className="hover:bg-accent p-2 cursor-pointer rounded-md relative">
                                    <MdAddModerator size={18} />
                                </div>
                                </CTFCompetitionForm>
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
