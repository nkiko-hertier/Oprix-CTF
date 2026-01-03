import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export default function FAQSection() {
  return (
    <section className="mt-10" id="faq">
      <div className="w-full h-auto overflow-hidden rounded-2xl bg-gradient-to-bl from-slate-800/75 relative">
        
        {/* Glow effects */}
        <div className="bg-blue-500 size-[60px] blur-3xl absolute bottom-[-40px] left-[40%]" />
        <div className="bg-pink-500 h-[160px] w-[30px] blur-3xl absolute bottom-[10px] left-[20px]" />

        <div className="py-12 px-6 flex flex-col items-center">
          
          {/* Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-slate-700/25 to-slate-900/25 w-fit p-2 rounded-full px-5 text-slate-400 mb-6">
            <HelpCircle className="text-white" />
            FAQ
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h1>

          {/* FAQ Accordion */}
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-2xl space-y-3"
          >
            <AccordionItem
              value="item-1"
              className="border-none border-slate-700/50 rounded-xl px-4 bg-gradient-to-r from-slate-700/25 to-slate-800/25"
            >
              <AccordionTrigger className="text-left ">
                What is this platform about?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400">
                This platform helps you learn, practice, and challenge yourself
                through interactive games and real-world scenarios.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border-none border-slate-700/50 rounded-xl px-4 bg-gradient-to-r from-slate-700/25 to-slate-800/25"
            >
              <AccordionTrigger className="text-left ">
                Is it free to use?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400">
                Yes. Core features are completely free. Some advanced tools may
                be added later as optional upgrades.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border-none border-slate-700/50 rounded-xl px-4 bg-gradient-to-r from-slate-700/25 to-slate-800/25"
            >
              <AccordionTrigger className="text-left ">
                Can I compete with friends?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400">
                Absolutely. You can join public challenges or create private
                ones to compete with your friends.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border-none border-slate-700/50 rounded-xl px-4 bg-gradient-to-r from-slate-700/25 to-slate-800/25"
            >
              <AccordionTrigger className="text-left ">
                How do I get started?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400">
                Simply create an account, explore available challenges, and
                start playing instantly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
