'use client';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { LuChevronLeft } from 'react-icons/lu';

function SwitchBack() {
    const location = useLocation();
    const pathname = location.pathname;


    const links = [
        { name: "Home", path: "/platform" },
        { name: "Learning", path: "/platform/learning" },
        { name: "Competition", path: "/platform/competition" },
        { name: "Profile", path: "/platform/profile" },
    ];

    if (!pathname) return null;
    return (
        <div>
            {
                (pathname === '/platform') ?
                    <div className='flex gap-10'>

                        <div className="logo">
                            <img
                                src="/img/logo_icon.png"
                                alt="logo"
                                width={30}
                                height={30}
                                className="left-[-35px]"
                            />
                        </div>

                        <span className='sm:blocks hidden p-3 bg-zinc-500/25 rounded-full'>

                        </span>

                        <ul className='gap-5 items-center md:justify-end hidden md:flex'>
                            {links.map((link) => {
                                const isActive = pathname === link.path;

                                return (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className={`${isActive ? "text-zinc-100" : "text-zinc-400"} transition-colors`}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                );
                            })}
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