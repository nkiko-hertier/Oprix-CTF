import { GradientCard } from '@/components/HomeCards'
import UserStats from '@/components/UserStats';
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom';

function PlatformHome() {
    const { user } = useUser();
    const username = user?.username ?? user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? "Guest";
    return (
        <div className=''>
            <h1 className='text-2xl mt-5 sm:text-3xl text-center sm:text-left'>👋  Hii, {username}<br /> whats on your mind today?</h1>
            <div className='mt-10 sm:grid grid-cols-2 gap-4 flex flex-col overflow-y-auto'>
                <Link to="/platform/Challanges">
                <GradientCard className='row-span-2 group/card1 cursor-pointer'>
                    <div className='h-1 w-full bg-slate-500/5 absolute -bottom-2.5 group-hover/card1:bottom-0'>
                        <div className='h-1 w-[0%] bg-blue-500 group-hover/card1:w-[30%]'></div>
                    </div>
                    <div className='absolute right-[-60px] top-0 opacity-50 group-hover/card1:opacity-100 group-hover/card1:scale-110'>
                        <img src="https://cdn.brain.fm/images/relax/relax_mental_state_bg_large_aura.webp" alt="Learning" width={400} height={400} />
                    </div>

                    <div className='h-full flex items-end p-6 pl-10 relative'>
                        <h1 className='text-5xl anton-font'>Learning</h1>
                        <p className='love-font text-5xl absolute text-yellow-500 top-[50px]'>with Challanges</p>
                    </div>
                </GradientCard>
                </Link>
                <Link to="/platform/competition">
                <GradientCard className='group/card2 cursor-pointer'>
                    <div className='absolute right-[-60px] top-0 opacity-50 group-hover/card2:opacity-100 group-hover/card2:scale-110'>
                        <img src="https://cdn.brain.fm/images/focus/focus_mental_state_bg_large_aura.webp" alt="Learning" width={400} height={400} />
                    </div>
                    <div className='h-full flex items-end p-6 pl-10 relative'>
                        <h1 className='text-5xl anton-font'>Explore Competitions</h1>
                        <p className='love-font text-5xl absolute text-yellow-500 top-[50px]'>Open opprtunities</p>
                    </div>
                </GradientCard>
                </Link>
            </div>
            <div className='mt-10'></div>
            {/* ---- User Stats ---- */}
            <UserStats />
        </div>
    )
}

export default PlatformHome