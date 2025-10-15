'use client'
import {

  Facebook,
  Linkedin,
  MessageCircleMore,
  Twitter,
  Youtube,
} from "lucide-react";

import ScrollVelocity from '@/components/ScrollVelocity';
import Link from "next/link";
import React from "react";
import {
  HomeFeatureCard,
  HomeStepsCard,
  ReviewCard,
} from "../components/HomeCards";
import Image from 'next/image'
import { ctfFeatures, ctfReviews } from "@/lib/objects";

function page() {
  return (
    <div>
      <div>
        <section className="md:text-center md:h-[calc(100vh-100px)] max-md:my-15  gap-7 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold">
            We Launch Competitions
          </h1>
          <p className="text-slate-400">Grow endlessly with our platform</p>
          <div className="flex md:justify-center gap-3 mt-5">
            <Link
              className="p-3 px-5 w-fit rounded-md block bg-gradient-to-bl hover:scale-110 from-blue-500 to-blue-700"
              href={"#"}
            >
              Get Started
            </Link>
            <Link
              className="p-3 px-5 w-fit rounded-md block bg-gradient-to-bl hover:scale-110 from-slate-700 to-slate-900"
              href={"#"}
            >
              Explore More
            </Link>
          </div>
        </section>
        <section>
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
      </div>
      <section className="md:p-30 max-md:mt-20 relative">
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
        <ScrollVelocity
          texts={['React Bits', 'Scroll Down']} 
          velocity={20} 
          className="custom-scroll-text"
        />
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
          <Image src={'/img/grid.png'} width={1000} height={400} alt="" className=" scale-170" />
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
          className="p-3 px-15 mt-10 mx-auto w-fit rounded-md block bg-gradient-to-bl hover:scale-110 from-blue-500 to-blue-700"
          href={"#"}
        >
          Create Account
        </Link>
      </section>

      <section className="my-10 relative">



        <div className="absolute translate-x-[-50%] left-[50%] top-[130px]">
          <Image src={'/img/social.png'} width={1000} height={400} alt="" className=" scale-170" />
        </div>
        <h1 className="text-5xl font-bold text-center mt-30">Social</h1>

        <div className="mx-auto my-10 w-fit">Logo</div>

        <div className="mx-auto w-fit flex gap-5">
          <Link href={"#"}>
            <Facebook size={30} />
          </Link>
          <Link href={"#"}>
            <Linkedin size={30} />
          </Link>
          <Link href={"#"}>
            <Twitter size={30} />
          </Link>
          <Link href={"#"}>
            <Youtube size={30} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default page;
