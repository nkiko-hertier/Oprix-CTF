import { UserButton, useUser } from "@clerk/clerk-react";
import { GradientCard } from "../../components/HomeCards";
import { RiHomeSmile2Fill, RiVipCrown2Fill } from "react-icons/ri";
import { FaGraduationCap } from "react-icons/fa";
import { PiSidebarSimpleFill } from "react-icons/pi";
import SwitchBack from "../SwitchBack";
import { Navigate, Outlet} from "react-router-dom";

function PlatformLayout() {
  const { user, isLoaded, isSignedIn } = useUser();

if (!isLoaded || !isSignedIn) {
    return <Navigate to="/" replace />
 } else if (user.publicMetadata.role !== 'USER') {
    return <Navigate to="/" replace />
 }
  return (
    <>
    <div className='h-screen overflow-y-auto bg-zinc-950 text-white p-2'>
        <GradientCard className='min-h-full p-4'>
            <div>
                <div className='text-white py-5 md:w-[80%] mx-auto justify-between flex items-center'>
                    <SwitchBack />
                    <span className='block scale-110'>
                        <UserButton />
                    </span>
                </div>
                <div className='md:w-[80%] mx-auto '>
                    <Outlet />
                </div>
            </div>
        </GradientCard>
        <div className="bg-white/10 md:hidden rounded-md grid grid-cols-4 min-h-[50px] sticky bottom-2 md:w-[80%] mx-auto mt-5 backdrop-blur-xl">
            <span className="text-center flex flex-col items-center justify-center p-2">
                <RiHomeSmile2Fill size={25} className="mx-auto" />
                <h1 className="text-sm">Home</h1>
            </span>
            <span className="text-center flex flex-col items-center justify-center p-2">
                <FaGraduationCap size={25} className="mx-auto" />
                <h1 className="text-sm">Learn</h1>
            </span>
            <span className="text-center flex flex-col items-center justify-center p-2">
                <RiVipCrown2Fill size={25} className="mx-auto"   />
                <h1 className="text-sm">Competitions</h1>
            </span>
            <span className="text-center flex flex-col items-center justify-center p-2">
                <PiSidebarSimpleFill size={26} />
                <h1 className="text-sm">More</h1>
            </span>
        </div>
    </div>
    </>
  );
}

export default PlatformLayout;
