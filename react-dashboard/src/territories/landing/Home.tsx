"use client"
import React, { useEffect, useState } from 'react'
import { FaFacebook, FaLinkedin } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { GrTwitter } from 'react-icons/gr'
import { TfiYoutube } from 'react-icons/tfi'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { ArrowRight, Home } from 'lucide-react'
import { MobileMenu } from './competitions/MobileMenu'
// import SvgFixer from './competitions/SVgFixer'

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState("home")

    const toggleMenu = () => setMenuOpen(!menuOpen)

    // Detect which section is in view (scroll spy)
    useEffect(() => {
        const sections = document.querySelectorAll("section[id]")
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { threshold: 0.4 }
        )
        sections.forEach(section => observer.observe(section))
        return () => sections.forEach(section => observer.unobserve(section))
    }, [])

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id)
        if (section) {
            section.scrollIntoView({ behavior: "smooth" })
            setMenuOpen(false)
        }
    }
    return (
        <div className='bg-[#100E19] h-screen relative overflow-y-auto text-white'>
            <div className='-z-20'>
                <div className='bg-[url(/img/pattern1.png)] opacity-30 absolute left-0 top-0 w-full bg-cover bg-center min-h-screen'></div>
                {/* Gradient BG */}
                <div className='bg-linear-to-b to-[#100E19] via-[#100E19]/80 from-[#100E19]/0 absolute left-0 top-0 w-full h-full'></div>
            </div>

            <div className='md:p-10 p-5 sticky top-0 z-30'>
                <nav className='min-h-[70px] backdrop-blur-sm bg-slate-600/10 borders rounded-full border-[#4e486a] px-5 flex justify-between items-center'>
                    <div className="logo">
                        <img
                            src="/img/logo_icon.png"
                            alt="logo"
                            width={30}
                            height={30}
                            className="left-[-35px]"
                        />
                    </div>
                    <div className="links">
                        <ul className='gap-10 items-center h-full hidden md:flex'>
                            {[
                                { id: "home", label: "Home" },
                                { id: "howitworks", label: "How it works" },
                                { id: "faq", label: "FAQ" },
                                { id: "contact", label: "Contact us" },
                            ].map((link) => (
                                <li
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className={`cursor-pointer transition-colors duration-300 ${activeSection === link.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {link.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='hidden md:block'>
                        <SignedOut>
                                <Link to="auth/sign-up" className='bg-[#573BA8] p-3 px-7 rounded-full text-sm'>Get Started</Link>
                        </SignedOut>
                        <SignedIn>
                            <Link to={'/onboarding'} className='bg-[#573BA8] flex gap-2 p-3 px-7 items-center rounded-full text-sm'>Dashboard <ArrowRight size={15} /> </Link>
                        </SignedIn>
                    </div>
                    <div className=' md:hidden'>
                        <MobileMenu scrollToSection={scrollToSection} activeSection={activeSection} />
                    </div>
                </nav>
            </div>
            <section id='home' className='my-20 text-center z-10 relative space-y-5 min-h-[50vh] flex flex-col justify-center items-center'>
                <div className='size-10 w-[200px] bg-indigo-500 blur-3xl absolute top-15'></div>
                <h1 className='text-4xl md:text-5xl font-semibold'>Your Digital Safety Net,<br /> On Autopilot</h1>
                <p className='text-sm'>Think Deeper. Build Better. Think Deeper. Build Better.</p>

                <div className='mt-10 flex-col flex sm:flex-row gap-5'>
                    <button className='sm:w-fit w-full bg-[#573BA8] p-3 px-7 rounded-full text-sm'>Try Now for free</button>
                    <button className='sm:w-fit w-full bg-white p-3 px-7 rounded-full text-black text-sm'>Learn More</button>
                </div>
            </section>

            {/* Features SEction */}
            <section id="features" className='my-20 z-20 relative'>
                <div className='grid md:grid-cols-3 gap-5'>
                    <div className='md:col-span-2'>
                        <h1 className='text-2xl'>Building Cyber-Smart Communities Across Africa</h1>
                        <p className='text-slate-300 mt-5'>
                            Oprix CTF connects students, universities, and tech enthusiasts through
                            real-world cybersecurity challenges. Our mission is to strengthen
                            digital awareness and inspire young talents to protect Africa’s digital
                            future through hands-on Capture The Flag (CTF) experiences.
                        </p>
                    </div>
                    <div className='min-h-[200px] flex flex-col items-center justify-center md:items-end md:justify-end p-3 border border-[#4e486a]'>
                        <h1 className='text-6xl'>23,000 <span className='text-[#573BA8]'>+</span></h1>
                        <p className='text-slate-300'>Students in the Pregram</p>
                    </div>
                    <div className='min-h-[200px] flex flex-col items-center justify-center md:items-end md:justify-end p-3 border border-[#4e486a]'>
                        <h1 className='text-6xl'>230 <span className='text-[#573BA8]'>+</span></h1>
                        <p className='text-slate-300'>Students in the Pregram</p>
                    </div>
                    <div className='min-h-[200px] flex flex-col items-center justify-center md:items-end md:justify-end p-3 border border-[#4e486a]'>
                        <h1 className='text-6xl'>980.00 <span className='text-[#573BA8]'>+</span></h1>
                        <p className='text-slate-300'>Students in the Pregram</p>
                    </div>
                    <div className='min-h-[200px] flex flex-col items-center justify-center md:items-end md:justify-end p-3 border border-[#4e486a]'>
                        <h1 className='text-6xl'>40.00 <span className='text-[#573BA8]'>+</span></h1>
                        <p className='text-slate-300'>Students in the Pregram</p>
                    </div>
                </div>
            </section>

            {/* How it works section */}

            <section id="howitworks" className='my-20 md:mt-30'>
                <h1 className='text-3xl font-semibold text-center'>How it Works</h1>

                <div className='mt-10 md:mt-30 flex flex-col gap-10'>
                    <div className='flex gap-5 md:gap-10 md:w-1/2 md:flex-row-reverse'>
                        <p className='text-8xl text-indigo-700/25'>1</p>
                        <div className='md:text-right'>
                            <h2 className='text-2xl'>Create an Account</h2>
                            <p className='mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem placeat delectus odit, quaerat a dolor officiis ipsum non asperiores velit dolorem eligendi rem laboriosam. Odit, omnis? Dolore facilis a dolor?</p>
                        </div>
                    </div>
                    <div className='flex gap-5 md:gap-10 md:w-1/2 ml-auto'>
                        <p className='text-8xl text-indigo-700/25'>2</p>
                        <div className=''>
                            <h2 className='text-2xl'>Create an Account</h2>
                            <p className='mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem placeat delectus odit, quaerat a dolor officiis ipsum non asperiores velit dolorem eligendi rem laboriosam. Odit, omnis? Dolore facilis a dolor?</p>
                        </div>
                    </div>
                    <div className='flex gap-5 md:gap-10 md:w-1/2 md:flex-row-reverse'>
                        <p className='text-8xl text-indigo-700/25'>3</p>
                        <div className='md:text-right'>
                            <h2 className='text-2xl'>Create an Account</h2>
                            <p className='mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem placeat delectus odit, quaerat a dolor officiis ipsum non asperiores velit dolorem eligendi rem laboriosam. Odit, omnis? Dolore facilis a dolor?</p>
                        </div>
                    </div>
                    <div className='flex gap-5 md:gap-10 md:w-1/2 ml-auto'>
                        <p className='text-8xl text-indigo-700/25'>4</p>
                        <div className=''>
                            <h2 className='text-2xl'>Create an Account</h2>
                            <p className='mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem placeat delectus odit, quaerat a dolor officiis ipsum non asperiores velit dolorem eligendi rem laboriosam. Odit, omnis? Dolore facilis a dolor?</p>
                        </div>
                    </div>

                </div>
            </section>


            {/* Frequently Asked Questions */}

            <hr className='my-10 md:mt-30 border-[#4e486a]' />

            <section id='faq' className='my-20 grid md:grid-cols-3'>
                <h1 className="text-3xl font-semibold mb-10 md:mb-0">Frequently <br />Asked <br /> Questions</h1>
                <div className=" flex col-span-2 flex-col gap-5 mx-auto w-full">
                    <div className="p-5 w-full rounded-md">
                        <h2 className="font-semibold">What is Oprix CTF African?</h2>
                        <p className="text-slate-300 mt-2">
                            Oprix CTF African is a platform that offers Capture The Flag
                            competitions focused on cybersecurity challenges for individuals
                            and teams across Africa.
                        </p>
                    </div>
                    <div className="p-5 w-full rounded-md">
                        <h2 className="font-semibold">How do I participate in a CTF?</h2>
                        <p className="text-slate-300 mt-2">
                            To participate, simply create an account on our platform, browse
                            the available CTF competitions, and register for the one that
                            interests you.
                        </p>
                    </div>
                    <div className="p-5 w-full rounded-md">
                        <h2 className="font-semibold">Are there any fees to join?</h2>
                        <p className="text-slate-300 mt-2">
                            Many of our CTF competitions are free to join, but some may have
                            entry fees. Please check the specific competition details for
                            more information.
                        </p>
                    </div>
                    <div className="p-5 w-full rounded-md">
                        <h2 className="font-semibold">What skills do I need?</h2>
                        <p className="text-slate-300 mt-2">
                            Oprix CTF African welcomes participants of all skill levels, from
                            beginners to advanced cybersecurity enthusiasts. We offer a range
                            of challenges to suit different expertise levels.
                        </p>
                    </div>
                </div>
            </section>


            {/* Conatct Us section */}

            <section id='contact' className='py-20 bg-linear-to-br from-[#2b293799] via-[#03010C99] shadow-2xl rounded-lg to-[#2b293799] min-h-[100px] p-3 sm:p-10'>
                <h1 className='text-3xl font-semibold text-center'>Have more questions?</h1>
                <p className='text-slate-300 text-center mt-5'>In the work that I do, I sometimes need ireframes/prototypes that are in or. <br />To make the work easier, I'</p>
                <div className='mt-10 sm:flex justify-center sm:bg-white/10 text-white p-1 rounded-full w-fit mx-auto'>
                    <input type="text" placeholder='Leave your email..' className='outline-none text-white px-4 max-sm:bg-white/10 w-full rounded-full max-sm:p-3' />
                    <button className='bg-[#573BA8] sm:w-fit w-full p-3 md:px-7 px-4 rounded-full text-sm max-sm:mt-3'>Contact Us</button>
                </div>
            </section>

            <footer className='bg-[#03010C99] min-h-[200px] mt-10 p-5'>
                <div className='grid md:grid-cols-2 md:w-[90%] mx-auto'>
                    <div>
                        <div className="logo flex gap-2 items-center">
                            <img
                                src="/img/logo_icon.png"
                                alt="logo"
                                width={70}
                                height={70}
                                className="block max-md:hidden left-[-35px]"
                            />
                            <p>Oprix CTF</p>
                        </div>
                        <p className='md:w-[90%] mt-5 text-zinc-400'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto, eos. Magnam totam, ipsam repellat eum earum iusto nemo laudantium amet vero natus voluptatem odio alias veritatis distinctio illum ea dignissimos.</p>
                        {/* Social Links */}
                        <div className='flex gap-5 mt-5'>
                            <Link to={'#'} className='bg-slate-800 p-3 rounded-full'>
                                <FaLinkedin />
                            </Link>
                            <Link to={'#'} className='bg-slate-800 p-3 rounded-full'>
                                <FaFacebook />
                            </Link>
                            <Link to={'#'} className='bg-slate-800 p-3 rounded-full'>
                                <GrTwitter />
                            </Link>
                            <Link to={'#'} className='bg-slate-800 p-3 rounded-full'>
                                <TfiYoutube />
                            </Link>
                        </div>
                    </div>
                    <div className="links">
                        <ul className='flex gap-5 items-start mt-10 md:justify-end h-full'>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">How it works</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contact us</a></li>
                        </ul>
                    </div>
                </div>
                <div className='mt-10 md:w-[90%] mx-auto'>
                    <p>&copy; Copyright Oprix 2025. All Right reserved.</p>
                </div>
            </footer>

        </div>
    )
}

export default HomePage;