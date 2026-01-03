'use client'
import {

    Facebook,
    Linkedin,
    MessageCircleMore,
    Twitter,
    Youtube,
} from "lucide-react";

// import ScrollVelocity from '@/components/ScrollVelocity';
import { Link } from "react-router-dom";
import {
    HomeFeatureCard,
    HomeStepsCard,
    ReviewCard,
} from "../../components/HomeCards";
import { ctfFeatures, ctfReviews } from "@/lib/objects";
import HomeLayout from "@/components/layouts/HomeLayout";
import FAQSection from "./competitions/FaqSection";
import { TargetCursor } from "../../components/TargetCursor";
import { RiDiscordFill } from "react-icons/ri";

function Home2() {
    return (
        <div>
            <div>
                <section hidden className="md:text-center md:h-[calc(100vh-100px)] max-md:my-15  gap-7 flex flex-col justify-center relative">


                    <div className="bg-gradient-to-bl from-blue-500 absolute to-blue-200 w-[500px] blur-3xl h-[40px] rotate-45 left-[-300px] bottom-[500px]"></div>
                    <div className="bg-gradient-to-bl from-pink-500 absolute to-pink-200 w-[500px] blur-3xl h-[10px] -rotate-45 left-[-100px] bottom-[550px]"></div>
                    <div className="grid ">
                        <div>
                            <div className="relative">
                                <h1 data-aos="fade-up" className="text-6xl text-slate-500 relative lg:text-8xl font-bold font-['Anton']">
                                    WELCOME TO <br />
                                    <span className="text-white">Oprix CTF</span>
                                    <img src="plane.png" className="absolute w-[300px] left-[200px] top-[-150px]" alt="" />
                                </h1>
                                <img src="/img/stars.png" className="absolute size-[100px] right-[-180px] lg:left-[-60px] top-[-150px] lg:top-[-100px]" alt="" />
                                <img src="plane.png" className="absolute size-[300px] blur-sm right-[-180px] lg:right-[-60px] top-[-150px] lg:top-[-100px]" alt="" />
                            </div>
                            <p className="text-slate-400">Grow endlessly with our platform</p>
                            <div className="flex justify-center gap-3 mt-5">
                                <Link
                                    className="p-3 px-5 cursor-target w-fit rounded-md block bg-gradient-to-bl hover:scale-110 from-blue-500 to-blue-700"
                                    to={"/auth/sign-in"}
                                >
                                    Get Started
                                </Link>
                                <Link
                                    className="p-3 px-5 cursor-target w-fit rounded-md block bg-gradient-to-bl hover:scale-110 from-slate-700 to-slate-900"
                                    to={"/competitions"}
                                >
                                    Explore More
                                </Link>
                            </div>
                        </div>

                    </div>
                </section>
                <TargetCursor
                    spinDuration={2}
                    hideDefaultCursor={true}
                    parallaxOn={true}
                />
                <section hidden>
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-4 gap-4 max-sm:w-[calc((100vw*4)-(100px*4))] max-md:w-[calc((100vw*2)-(100px*4))]">
                            {ctfFeatures.map((feature) => (
                                <HomeFeatureCard
                                    key={feature.id}
                                    metric={feature.metric}
                                    label={feature.label}
                                    Icon={feature.Icon}
                                    iconColorClass={feature.iconColorClass}
                                />
                            ))}
                        </div>
                    </div>
                </section>
                <section className="pt-10 relative">
                <div className="absolute left-[200px]">
                </div>
                <div className="bg-gradient-to-bl from-red-500 absolute to-red-200 w-[500px] blur-3xl h-[40px] rotate-45 left-[-300px] top-[-150px]"></div>
                <div className="bg-gradient-to-bl from-red-500 absolute to-red-200 w-[500px] blur-3xl h-[40px] -rotate-45 right-[-300px] top-[-150px]"></div>
                <div className="bg-gradient-to-bl from-blue-500 absolute to-blue-200 w-[500px] blur-3xl h-[40px] rotate-45 left-[-300px] bottom-[500px]"></div>
                <div className="bg-gradient-to-bl from-blue-500 absolute to-blue-200 w-[500px] blur-3xl h-[40px] -rotate-45 right-[-300px] bottom-[500px]"></div>
                    <div className="p-2 bg-white/5 w-fit mx-auto px-5 rounded-full text-blue-500"> • &nbsp; Exprience premium Exprience </div>
                    <h1 className="text-5xl md:text-6xl text-center font-bold mx-auto md:w-[80%]">Sharpen your skills with <span className="whitespace-nowrap font-extralight font-[Handlee] inline-flex items-center text-3xl md:text-6xl">Capturing Fl<img src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6729d76b04ef7312d3dfd2fd_Set%202%204.webp" className="inline-block" width='60px' alt="" />g (ctf)</span>  <br /> exercises </h1>
                    <p className="md:w-[60%] mt-4 text-slate-400 mx-auto text-center">InfoSec Giants is a cybersecurity platform where beginners and professionals sharpen their skills through hands-on Capture The Flag (CTF) challenges and real-world security competitions.</p>
                    <div className="mx-auto w-fit mt-5">
                        
                    <Link
                                    className="p-3 px-10 cursor-target w-fit rounded-full block bg-gradient-to-bl hover:scale-110 from-blue-500 to-blue-700"
                                    to={"/auth/sign-in"}
                                >
                                    Join its free
                                </Link>
                    </div>
                    <div className="hidden lg:block">
                        <div className="mt-10 w-fit mx-auto">
                            <img src="/sample.PNG" alt="hey" />
                        </div>
                    </div>
                </section>
            </div>
            <section className="md:p-30 max-md:mt-20 relative" id="howitworks">
                <div className="bg-gradient-to-bl from-blue-500 absolute to-blue-200 w-[500px] blur-3xl h-[40px] rotate-45 left-[-300px] bottom-[500px]"></div>
                <div className="bg-gradient-to-bl from-blue-500 absolute to-blue-200 w-[500px] blur-3xl h-[40px] -rotate-45 right-[-300px] bottom-[500px]"></div>
                <h1 className="text-3xl font-bold sm:text-center max-md:mt-5">
                    How It works
                </h1>
                <div className="md:mt-20 mt-5 grid md:grid-cols-2 gap-4">
                    <HomeStepsCard step={1} title="Create an account">
                        Create a free account via our platform, complete your profile
                        details and Explore the platform.
                    </HomeStepsCard>
                    <HomeStepsCard step={2} title="Explore Competitions">
                        Our platform is designed to host different competition around Africa
                        in all levels + beginner friendly ones.
                    </HomeStepsCard>
                    <HomeStepsCard step={3} title="Join a Competitions">
                        You will be able to join different competitions to grow your talent
                        and earn rewards
                    </HomeStepsCard>
                    <HomeStepsCard step={4} title="Grow forever">
                        You think you arent good yet! you still enjoy our dairly beginner
                        friendly challenges.
                    </HomeStepsCard>
                </div>
            </section>
            <section className="w-screen! text-slate-700/50! hidden md:block srollv-section relative overflow-x-hidden">
                {/* <ScrollVelocity
          texts={[' * African', 'Solutions * ']} 
          velocity={20} 
          className="custom-scroll-text"
        /> */}
            </section>
            <section>
                <div className="mt-10">
                    <div className=" w-full h-[420px] overflow-hidden rounded-2xl bg-gradient-to-bl from-slate-800/75 relative">
                        <div className="bg-blue-500 size-[50px] blur-2xl absolute bottom-[-40px] left-[40%]"></div>
                        <div className="bg-pink-500 size-[20px] h-[140px] blur-3xl absolute bottom-[10px] left-[10px]"></div>
                        <div className="py-10 flex flex-col justify-center size-full">
                            <h1 className="text-xl text-center flex gap-2 bg-gradient-to-r from-slate-700/25 to-slate-900/25 w-fit p-2 rounded-full px-5 mx-auto text-slate-400 mt-5">
                                <MessageCircleMore className="text-white" />
                                Hi 👋 there. Hope yo good?
                            </h1>
                            <h1 className="text-5xl font-bold text-center">
                                Lets pray a game!
                            </h1>
                            <div className="bg-gradient-to-r mt-10 mx-auto w-[300px] flex justify-between p-2 rounded-full bg-slate-700/25 to-slate-900/25 ">
                                <p className="p-1 pl-3">
                                    Sure lets do it 🥴 <span className="animate-pulse">|</span>
                                </p>
                                <button className="p-1 px-5 w-fit rounded-full cursor-pointer shadow-2xl block bg-gradient-to-bl hover:scale-110 from-blue-500 to-blue-700">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mt-20">
                <div className="relative">

                    <div className="w-[200px] absolute translate-x-[-50%] left-[50%] top-[-50px]">
                        <img src={'/img/grid.png'} width={1000} height={400} alt="" className=" scale-170" />
                    </div>
                    <div className="bg-gradient-to-bl from-blue-500/25 absolute to-blue-200/25 w-[500px] blur-3xl h-[40px] translate-x-[-50%] left-[50%]"></div>
                    <h1 className="text-5xl font-bold text-center mt-10">
                        Hear It From Our Community{" "}
                    </h1>
                    <p className="text-center mt-4 text-xl text-slate-500">
                        what our customers says!
                    </p>
                </div>

                <div className="grid md:grid-cols-3 mt-20 gap-3">
                    {ctfReviews.map((review) => (
                        <ReviewCard key={review.id} {...review} />
                    ))}
                </div>

                <Link
                    className="p-3 cursor-target group flex gap-2 items-center px-4 mt-10 mx-auto w-fit rounded-md block bg-gradient-to-bl hover:scale-110 from-blue-500 to-blue-700"
                    to={"#"}
                >
                    <RiDiscordFill size={25} className="group-hover:rotate-[360deg]" />
                    Join Our Community
                </Link>
            </section>

            <FAQSection />

            <section className="my-10 relative">



                <div className="absolute translate-x-[-50%] left-[50%] bottom-[10px]">
                    <img src={'/img/social.png'} width={1000} height={400} alt="" className=" scale-190" />
                </div>
                <h1 className="text-5xl font-bold text-center mt-30">Social</h1>

                <div className="mx-auto my-10 w-fit">

                    <img
                        src="/img/logo_icon.png"
                        alt="logo"
                        width={100}
                        height={100}
                        className="z-20 relative"
                    />
                </div>

                <div className="mx-auto w-fit flex gap-5">
                    <Link to={"#"}>
                        <Facebook size={30} />
                    </Link>
                    <Link to={"#"}>
                        <Linkedin size={30} />
                    </Link>
                    <Link to={"#"}>
                        <Twitter size={30} />
                    </Link>
                    <Link to={"#"}>
                        <Youtube size={30} />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home2;
