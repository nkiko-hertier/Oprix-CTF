import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Users2, Shield, Brain } from "lucide-react"; // Icons for the mission section
import { GradientCard } from "@/app/components/HomeCards";

// --- Mock Team Data (Replace with real names/links/images) ---
const teamMembers = [
  {
    id: 1,
    name: "Nkiko Hertier",
    role: "Founder & Lead Developer",
    image: "/team/nkiko.jpg", // Placeholder
    social: "https://twitter.com/snaow", // Placeholder
  },
  {
    id: 2,
    name: "Alex 'Root' Chen",
    role: "Chief Cybersecurity Architect",
    image: "/team/alex.jpg", // Placeholder
    social: "https://linkedin.com/in/alex", // Placeholder
  },
  {
    id: 3,
    name: "Maya Varma",
    role: "Content & Education Lead",
    image: "/team/maya.jpg", // Placeholder
    social: "https://github.com/maya", // Placeholder
  },
];

// --- Sub-Components for Reusability ---

interface MissionCardProps {
  title: string;
  description: string;
  Icon: React.ElementType;
}

const MissionCard: React.FC<MissionCardProps> = ({
  title,
  description,
  Icon,
}) => (
  <GradientCard>
    <div className="p-6 rounded-xl text-center flex flex-col items-center gap-4 transition-all ">
      <Icon className="text-blue-500" size={36} />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  </GradientCard>
);

interface TeamCardProps {
  name: string;
  role: string;
  image: string;
  social: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ name, role, image, social }) => (
  <GradientCard>
    <div className="flex flex-col items-center p-6 rounded-xl transition-all">
      <div className="size-24 rounded-full overflow-hidden mb-4 border-4 border-blue-500">
        <Image
          src={image}
          alt={name}
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <h3 className="text-xl font-bold text-white">{name}</h3>
      <p className="text-sm text-blue-400 mb-3">{role}</p>
      <Link
        href={social}
        target="_blank"
        className="text-slate-500 hover:text-blue-500 transition-colors text-sm"
      >
        Connect
      </Link>
    </div>
  </GradientCard>
);

function page() {
  return (
    <div className="min-h-screen text-white">
      {/* 1. Hero Section (Already built) */}
      <section className="text-center max-md:py-10 max-md:mt-10 md:h-[calc(100vh-100px)] gap-7 flex flex-col justify-center max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-7xl font-extrabold md:bg-clip-text md:text-transparent md:bg-gradient-to-r from-blue-400 to-cyan-500">
          About Us
        </h1>
        <p className="md:text-xl text-slate-400 max-w-2xl mx-auto">
          We are dedicated to building the future of cybersecurity education.
          Grow your skills endlessly with our platform, designed for everyone
          from absolute beginners to advanced ethical hackers.
        </p>
        <div className="md:flex justify-center gap-4 max-md:space-y-4 text-center mt-8">
          <Link
            className="p-3 px-6 w-full md:w-fit rounded-lg block bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 transition-transform duration-300 hover:scale-[1.03] hover:from-blue-600 hover:to-blue-800"
            href={"/signup"} // Assumed link
          >
            Get Started
          </Link>
          <Link
            className="p-3 px-5 w-full md:w-fit rounded-md block bg-gradient-to-bl hover:scale-110 from-slate-700 to-slate-900"
            href={"/challenges"} // Assumed link
          >
            Explore Challenges
          </Link>
        </div>
      </section>

      {/* --- Our Mission Section --- */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="md:text-4xl text-xl md:font-bold md:text-center mb-4">
            Our Mission
          </h2>
          <p className="md:text-center md:text-xl text-slate-400 mb-16">
            To provide accessible, engaging, and practical cybersecurity
            training to the global community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MissionCard
              title="Empower Growth"
              description="Fuel the next generation of cybersecurity professionals with hands-on, realistic challenges."
              Icon={Users2}
            />
            <MissionCard
              title="Foster Security"
              description="Promote a culture of ethical hacking and responsible disclosure to build a safer digital world."
              Icon={Shield}
            />
            <MissionCard
              title="Innovate Learning"
              description="Continuously develop new, cutting-edge content and features to keep skills current and relevant."
              Icon={Brain}
            />
          </div>
        </div>
      </section>

      {/* --- The Team Behind Section --- */}
      <section className="py-24 border-t border-slate-700">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            The Team Behind CipherCraft
          </h2>
          <p className="text-center text-xl text-slate-400 mb-16">
            We are a small, dedicated team of developers, educators, and
            security experts committed to your success.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamCard
                key={member.id}
                name={member.name}
                role={member.role}
                image={member.image}
                social={member.social}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- Call to Action Footer --- */}
      <GradientCard>
        <section className="py-20 text-center px-5">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Level Up Your Hacking Skills?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Join thousands of others mastering the art of cybersecurity.
          </p>
          <Link
            className="p-4 px-8 w-fit rounded-lg font-bold block bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg shadow-blue-500/50 transition-transform duration-300 hover:scale-[1.05] mx-auto"
            href={"/signup"}
          >
            Start Hacking Now
          </Link>
        </section>
      </GradientCard>
    </div>
  );
}

export default page;
