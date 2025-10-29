import Announcements from "@/components/competition-tabs/Announcements";
import Challenges from "@/components/competition-tabs/Challenges";
import Leaderboard from "@/components/competition-tabs/Leaderboard";
import Members from "@/components/competition-tabs/Members";
import Teams from "@/components/competition-tabs/Teams";
import { cn } from "@/lib/utils";
import { ArrowRight, Circle, Flag } from "lucide-react"
import { useState } from "react";

function Competition() {
    type CompetitionTab = 'Announcements' | 'Challenges' | 'Members' | 'Teams' | 'Leaderboard';
    // Announcements.tsx Challenges.tsx Members.tsx Teams.tsx Leaderboard.tsx
    const [activeTab, setActiveTab] = useState<CompetitionTab>('Announcements');
    const Tabs: CompetitionTab[] = ['Announcements', 'Challenges', 'Members', 'Teams', 'Leaderboard'];

  return (
    <div>
        <div className=" bg-background cursor-pointer group h-[200px] flex flex-col border border-dashed rounded-md p-1">
          <div className="h-full bg-accent w-full rounded-md border-border flex flex-col justify-between p-4">
            <div className="flex justify-between">
              <Flag size={13} className="text-muted-foreground"/>
              <p className="text-sm text-muted-foreground">auca.ac.rw</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Beginner</p>
              <div className="">Basic Ethical Hacking</div>
              <p className="text-sm bg-card w-fit px-2 mt-2 rounded-md border text-muted-foreground flex gap-1 items-center"><Circle size={10} /> open</p>
            </div>
          </div>
          <div className="text-muted-foreground flex gap-2 *:py-2 px-2 *:cursor-pointer text-sm *:hover:text-white">
            {/* Competition Tabs */}
            {Tabs.map((tab) => {
                const isActive = tab === activeTab;
                return (<button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                        "py-2",
                        isActive ? "text-white" : "text-muted-foreground"
                    )}
                >
                    {tab}
                </button>)
            })
            }
          </div>
        </div>
        <div className="mt-4">  
            <Announcements activeTab={activeTab} />
            <Challenges activeTab={activeTab} />   
            <Members activeTab={activeTab} />  
            <Teams activeTab={activeTab} />
            <Leaderboard activeTab={activeTab} />
          </div>
    </div>
  )
}

export default Competition