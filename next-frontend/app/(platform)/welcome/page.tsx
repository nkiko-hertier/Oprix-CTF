import { GradientCard } from '@/app/components/HomeCards'
import { LayoutDashboard, LayoutGrid, Menu } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image'
import React from 'react'
import { UserButton } from '@clerk/nextjs';

async function page() {
    const user = await currentUser();
    const username = user?.username ?? user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? "Guest";
  return (
    <div className='h-screen overflow-y-auto bg-zinc-950 text-white p-2'>
        <GradientCard className='min-h-full p-4'>
            <div>
                <div className='text-white py-5 md:w-[80%] mx-auto justify-between flex'>
                    <span className='sm:block hiddens p-3 bg-zinc-500/25 rounded-full'>
                        <LayoutDashboard size={26} />
                    </span>
                    <span className='block'>
                        <UserButton />
                    </span>
                </div>
                <div className='md:w-[80%] mx-auto '>
                    <h1 className='text-2xl mt-5 sm:text-3xl text-center sm:text-left'>Welcome {username},<br/> what do want today?</h1>
                    <div className='mt-10 sm:grid grid-cols-2 gap-4 flex flex-col overflow-y-auto'>
                        <GradientCard className='row-span-2 group/card1 cursor-pointer'>
                            <div className='absolute right-[-60px] top-0 opacity-50 group-hover/card1:opacity-100 group-hover/card1:scale-110'>
                                <Image src="https://cdn.brain.fm/images/relax/relax_mental_state_bg_large_aura.webp" alt="Learning" width={400} height={400} />
                            </div>
                            
                            <div className='h-full flex items-end p-6 pl-10'>
                                <h1 className='font-semibold text-2xl'>Learning</h1>
                            </div>
                        </GradientCard>
                        <GradientCard className='group/card2 cursor-pointer'>
                            <div className='absolute right-[-60px] top-0 opacity-50 group-hover/card2:opacity-100 group-hover/card2:scale-110'>
                                <Image src="https://cdn.brain.fm/images/focus/focus_mental_state_bg_large_aura.webp" alt="Learning" width={400} height={400} />
                            </div>
                            <div className='h-full flex items-end p-6 pl-10'>
                                <h1 className='font-semibold text-2xl'>Explore Competitions</h1>
                            </div>
                        </GradientCard>
                        <GradientCard className='group/card3 cursor-pointer'>
                            <div className='absolute right-[-60px] top-0 opacity-50 group-hover/card3:opacity-100 group-hover/card3:scale-110'>
                                <Image src="https://cdn.brain.fm/images/meditate/meditate_mental_state_bg_large_aura.webp" alt="Learning" width={400} height={400} />
                            </div>
                            <div className='h-full flex items-end p-6 pl-10'>
                                <h1 className='font-semibold text-2xl'>Practical activities</h1>
                            </div>
                        </GradientCard>
                    </div>
                    <h1 className='text-xl mt-10 text-slate-300'>Recent Activities</h1>
                </div>
            </div>
        </GradientCard>
    </div>
  )
}

export default page