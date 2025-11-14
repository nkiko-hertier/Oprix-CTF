
import { BsLayoutSidebarReverse } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { UserButton, useUser } from "@clerk/clerk-react";
import { GradientCard } from "../HomeCards";
import SidebarLinks from "../SideBarLinks";
import CTFCompetitionForm from "../Models/CompetitionsForm";
import { MdAddModerator } from "react-icons/md";
import { Toaster } from "sonner";
import { Navigate, Outlet } from "react-router-dom";
import { isClerkAuthed } from "@/lib/utils";

export default function AdminLayout() {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isClerkAuthed()) {
        return <Navigate to="/" replace />
    }

    if (isLoaded && !isSignedIn) {
        return <Navigate to="/" replace />
    }
    return (
        <div className="h-screen bg-background">
            <Toaster />
            <div className="flex">
                <aside className="h-screen w-1/3 md:w-1/4">
                    <GradientCard className="h-full p-2 rounded-none!">
                        <div className="logo flex p-4 items-center gap-2">
                            <img
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
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
