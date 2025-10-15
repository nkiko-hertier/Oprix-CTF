"use client";
import React, { useState } from "react";
import { ChevronDown, BookOpen, DollarSign, Users } from "lucide-react";

// --- Sub-Component: AccordionItem (Handles individual Q&A) ---

interface AccordionItemProps {
  question: string;
  answer: string;
  Icon: React.ElementType;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  Icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-700">
      {/* Question Header */}
      <button
        className="flex justify-between items-center w-full p-5 text-left text-lg font-semibold text-white transition-colors hover:bg-slate-800/50"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className="size-[3px] rounded-full"></span>
          <span>{question}</span>
        </div>
        <ChevronDown
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          size={20}
        />
      </button>

      {/* Answer Content */}
      <div
        className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
        style={{ maxHeight: isOpen ? "500px" : "0" }} // A large max-height for smooth transition
      >
        <div className="p-5 pt-0 text-slate-400 leading-relaxed">{answer}</div>
      </div>
    </div>
  );
};

// --- FAQ Data (Organized by category) ---

const faqData = [
  {
    category: "General Platform Questions",
    icon: Users,
    questions: [
      {
        q: "What is this platform used for?",
        a: "Our platform is a dedicated Capture The Flag (CTF) environment designed for learning and practicing cybersecurity skills. It offers hundreds of challenges across various domains like Web Exploitation, Cryptography, Reverse Engineering, and more.",
      },
      {
        q: "Do I need prior experience to start?",
        a: "No! We have a dedicated 'Beginner' track with foundational challenges and comprehensive tutorials (often called 'N00b' challenges) designed to get you started with zero prior hacking experience.",
      },
      {
        q: "Is the platform safe to use?",
        a: "Absolutely. All challenges run in isolated, sandboxed environments. While we encourage ethical hacking, attempting to attack the platform itself or other users is strictly forbidden and monitored. Practice only within the designated challenge environment.",
      },
    ],
  },
  {
    category: "Challenges & Learning",
    icon: BookOpen,
    questions: [
      {
        q: "How do I submit a flag?",
        a: "Once you solve a challenge, you will find a 'flag'—a uniquely formatted string (e.g., flag{th1s_is_th3_s3cr3t}). Enter this string into the submission box on the challenge page to earn points.",
      },
      {
        q: "What if I get stuck on a challenge?",
        a: "We offer several resources: 1) **Hints** (often costing a few points), 2) **Official Write-ups** (unlocked after a challenge is solved), and 3) **Community Forums** where you can ask for non-spoiler guidance.",
      },
      {
        q: "Are the challenges updated regularly?",
        a: "Yes. Our content team regularly adds new challenges to reflect the latest security vulnerabilities and technologies, ensuring your skills are always current.",
      },
    ],
  },
  {
    category: "Account & Pricing",
    icon: DollarSign,
    questions: [
      {
        q: "Is the platform free?",
        a: "We offer a generous free tier that includes access to all foundational and many intermediate challenges. We offer premium subscriptions for advanced content, dedicated private labs, and professional certifications.",
      },
      {
        q: "How do I reset my password?",
        a: "Navigate to the Login page and click the 'Forgot Password' link. You will receive an email with instructions to reset your password.",
      },
    ],
  },
];

// --- Main Page Component ---

function page() {
  return (
    <div className="min-h-screen text-white pt-20 pb-16">
      <header className="text-center mb-12 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-500 mb-4">
          Frequently Asked Questions.
        </h1>
        <p className="md:text-xl text-slate-400">
          Everything you need to know about getting started, challenges, and
          your account.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {faqData.map((category, index) => (
          <div
            key={index}
            className="mb-12 rounded-xl overflow-hidden shadow-2xl"
          >
            <h2 className="flex items-center gap-3 p-5 md:text-2xl font-bold bg-slate-300/10 border-b border-slate-700">
              <category.icon
                className="text-blue-500 hidden sm:block"
                size={28}
              />
              {category.category}
            </h2>

            <div>
              {category.questions.map((item, qIndex) => (
                <AccordionItem
                  key={qIndex}
                  question={item.q}
                  answer={item.a}
                  Icon={category.icon} // Pass the category icon to the item
                />
              ))}
            </div>
          </div>
        ))}

        <div className=" w-full p-3 min-h-[220px] flex justify-center items-center flex-col overflow-hidden rounded-2xl bg-gradient-to-bl from-slate-800/75 relative">
          <div className="bg-blue-500 size-[50px] blur-2xl absolute bottom-[-40px] left-[40%]"></div>
          <div className="bg-pink-500 size-[20px] h-[140px] blur-3xl absolute bottom-[10px] left-[10px]"></div>

          <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
          <p className="text-slate-400 text-center  mb-6">
            If you couldn't find an answer here, please don't hesitate to reach
            out to our support team.
          </p>
          <a
            href="mailto:support@yourplatform.com"
            className="p-3 px-6 w-fit rounded-lg font-semibold inline-block bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 transition-transform duration-300 hover:scale-[1.05]"
          >
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
}

export default page;
