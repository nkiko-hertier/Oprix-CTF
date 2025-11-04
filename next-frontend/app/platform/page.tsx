import { GradientCard } from '@/app/components/HomeCards'
import { LayoutDashboard, LayoutGrid, Menu } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image'
import React from 'react'
import Link from 'next/link';

async function page() {
    const user = await currentUser();
    const username = user?.username ?? user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? "Guest";
    return (
        <div className=''>
            <h1 className='text-2xl mt-5 sm:text-3xl text-center sm:text-left'>👋  Hii, {username}<br /> whats on your mind today?</h1>
            <div className='mt-10 sm:grid grid-cols-2 gap-4 flex flex-col overflow-y-auto'>
                <Link href="/platform/learning">
                <GradientCard className='row-span-2 group/card1 cursor-pointer'>
                    <div className='h-1 w-full bg-slate-500/5 absolute -bottom-2.5 group-hover/card1:bottom-0'>
                        <div className='h-1 w-[0%] bg-blue-500 group-hover/card1:w-[30%]'></div>
                    </div>
                    <div className='absolute right-[-60px] top-0 opacity-50 group-hover/card1:opacity-100 group-hover/card1:scale-110'>
                        <Image src="https://cdn.brain.fm/images/relax/relax_mental_state_bg_large_aura.webp" alt="Learning" width={400} height={400} />
                    </div>

                    <div className='h-full flex items-end p-6 pl-10'>
                        <h1 className='font-semibold text-2xl'>Learning</h1>
                    </div>
                </GradientCard>
                </Link>
                <Link href="/platform/competition">
                <GradientCard className='group/card2 cursor-pointer'>
                    <div className='absolute right-[-60px] top-0 opacity-50 group-hover/card2:opacity-100 group-hover/card2:scale-110'>
                        <Image src="https://cdn.brain.fm/images/focus/focus_mental_state_bg_large_aura.webp" alt="Learning" width={400} height={400} />
                    </div>
                    <div className='h-full flex items-end p-6 pl-10'>
                        <h1 className='font-semibold text-2xl'>Explore Competitions</h1>
                    </div>
                </GradientCard>
                </Link>
                <GradientCard className='group/card3 cursor-pointer'>
                    <div className='absolute right-[-60px] top-0 opacity-50 group-hover/card3:opacity-100 group-hover/card3:scale-110'>
                        <Image src="https://cdn.brain.fm/images/meditate/meditate_mental_state_bg_large_aura.webp" alt="Learning" width={400} height={400} />
                    </div>
                    <div className='h-full flex items-end p-6 pl-10'>
                        <h1 className='font-semibold text-2xl'>Practical activities</h1>
                    </div>
                </GradientCard>
            </div>
        </div>
    )
}

export default page