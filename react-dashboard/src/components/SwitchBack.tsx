'use client';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { LuChevronLeft } from 'react-icons/lu';

function SwitchBack() {
    const location = useLocation();
    const pathname = location.pathname;

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
                    : <Link to={'/platform'} className='flex gap-1 items-center'>
                        <LuChevronLeft /> Back to Home
                    </Link>
            }
        </div>
    )
}

export default SwitchBack