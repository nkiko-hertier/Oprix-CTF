'use client'
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface HomeFeatureCardProps {
  metric: string;
  label: string;
  Icon: LucideIcon;
  iconColorClass?: string;
}

export function HomeFeatureCard({
  metric,
  label,
  Icon,
  iconColorClass = "text-slate-400",
}: HomeFeatureCardProps) {
  return (
    <div className="borders rounded-xl w-full border-slate-800 bg-gradient-to-bl from-slate-800/75 min-h-[130px] overflow-hidden relative">
      <div className="bg-blue-500 size-[50px] blur-2xl absolute bottom-[-40px] left-[40%]"></div>
      <div className="absolute top-0 h-[1px] card-gradient-line bg-slate-600 w-full"></div>
      <div className="w-full h-full flex items-center justify-center gap-3">
        <div className="icon-area">
          <Icon className={iconColorClass} size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{metric}</h1>
          <p className="text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

interface stepsCardProps {
  title: string;
  children: string;
  step: number;
}

export function HomeStepsCard({ step, title, children }: stepsCardProps) {
  return (
    <div className=" w-full min-h-[220px] overflow-hidden rounded-2xl bg-gradient-to-bl from-slate-800/75 relative backdrop-blur-md">
      <div className="bg-blue-500 size-[50px] blur-2xl absolute bottom-[-40px] left-[40%]"></div>
      <div className="bg-pink-500 size-[20px] h-[140px] blur-3xl absolute bottom-[10px] left-[10px]"></div>
      <h1 className="absolute text-8xl font-extrabold bottom-[-15px] [-webkit-text-stroke:1px_#fff2] rotate-12 left-5 text-white/10">
        {step}
      </h1>
      <div className="size-full p-6">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-zinc-400 mt-2">{children}</p>
      </div>
    </div>
  );
}

interface ReviewCardProps {
  name: string;
  username: string;
  imageUrl: string;
  reviewContent: string;
  imageAlt: string;
}

export function ReviewCard({
  name,
  username,
  imageUrl,
  reviewContent,
  imageAlt,
}: ReviewCardProps) {
  return (
    <div className="w-full min-h-[100px] overflow-hidden rounded-2xl bg-gradient-to-bl from-slate-800/75 relative backdrop-blur-md">
      <div className="bg-yellow-500 size-[50px] blur-3xl absolute bottom-[-40px] left-[40%]"></div>
      <div className="bg-indigo-500 size-[20px] h-[140px] blur-3xl absolute bottom-[10px] left-[10px]"></div>

      <div className="flex flex-col p-5 size-full">
        <div className="flex items-center gap-2">
          <div className="overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-700 size-12 rounded-full">
            <Image
              src={imageUrl}
              className="size-full font-bold text-xl text-center flex justify-center items-center"
              width={48}
              height={48}
              alt={imageAlt}
            />
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold">{name}</h1>
            <p className="text-sm text-slate-500">@{username}</p>
          </div>
        </div>
        <p className="mt-4 text-white">{reviewContent}</p>
      </div>
    </div>
  );
}

export function CompetitionCard() {
  return (
    <div className=" w-full min-h-[220px] overflow-hidden rounded-2xl bg-gradient-to-bl from-slate-800/75 relative backdrop-blur-md">
      <div className="bg-blue-500 size-[50px] blur-2xl absolute bottom-[-40px] left-[40%]"></div>
      <div className="bg-pink-500 size-[20px] h-[140px] blur-3xl absolute bottom-[10px] left-[10px]"></div>
      <div className="size-full p-5">
        <div className="cover-img h-[200px]">
          <Image
            src="/img/homebg.webp"
            className=" object-center object-cover size-full rounded-md"
            width={300}
            height={300}
            alt="Competition bg"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold line-clamp-1 mt-3 mb-1">
            CodeWithSnaow Beginner cyber competition
          </h1>
          <p className="text-slate-500 text-sm line-clamp-3">
            CodeWithSnaow Beginner cyber competition Explore Competitions Grow
            endlessly with our Competition odeWithSnaow Beginner cyber co
            odeWithSnaow Beginner cyber co
          </p>
          <Link href={""} className="text-blue-500 my-4 block">
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}
interface GradProps {
  children: ReactNode,
  className: string
}
export function GradientCard({ children, className }: GradProps) {
  return (
    <div
      className={
        "w-full min-h-[220px] overflow-hidden rounded-2xl cursor-pointer bg-gradient-to-bl group from-slate-800/75 relative " +
        className
      }
    >
      <div className="bg-blue-500 size-[50px] blur-2xl group-hover:blur-3xl absolute bottom-[-40px] left-[40%] group-hover:left-[10%]"></div>
      <div className="bg-green-500 size-[50px] blur-2xl group-hover:blur-3xl absolute bottom-[-90px] right-[10%] group-hover:bottom-[-40px]"></div>
      <div className="bg-pink-500 size-[20px] h-[140px] blur-3xl group-hover:bottom-[50px] absolute bottom-[10px] left-[10px]"></div>
      {children}
    </div>
  );
}
