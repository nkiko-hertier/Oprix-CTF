'use client';

import { div } from 'motion/react-client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { BiHome, BiSolidHomeSmile } from 'react-icons/bi';
import { LuChevronLeft } from 'react-icons/lu';
import { PiSidebarSimpleLight } from 'react-icons/pi'

function SwitchBack() {
    const pathname = usePathname();

    if (!pathname) return null;
    return (
        <div>
            {
                (pathname === '/platform') ?
                    <div>

                        <span className='sm:blocks hidden p-3 bg-zinc-500/25 rounded-full'>
                            {/* <PiSidebarSimpleLight size={24} /> */}
                        </span>

                    <ul className='flex gap-5 items-center md:justify-end'>
                            <li><a href="#" className='text-zinc-100'>Home</a></li>
                            <li><a href="#" className='text-zinc-400'>Learning</a></li>
                            <li><a href="#" className='text-zinc-400'>Competition</a></li>
                            <li><a href="#" className='text-zinc-400'>Profile</a></li>
                        </ul>
                    </div>
                    : <Link href={'/platform'} className='flex gap-1 items-center'>
                        <LuChevronLeft /> Back to Home
                    </Link>
            }
        </div>
    )
}

export default SwitchBack