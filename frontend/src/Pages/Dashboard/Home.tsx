import AlertBox from "@/components/AlertBox";
import { CreateCompetition } from "@/components/CreateCompetition";
import { ArrowRight, Circle, Flag } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div>
      {/* Most recent announcement! */}
      <AlertBox type="Normal" title="Announcement">
        Hi there, hope your day closed greate. welcome back!
      </AlertBox>
      <h1 className="my-4 text-lg font-semibold py-4">Competitions</h1>

      <div className="grid relative sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <CreateCompetition>
          <div className="bg-accent cursor-pointer h-[200px] border border-dashed rounded-md flex">
            <p className="mx-auto my-auto text-muted-foreground">+ create competition</p>
          </div>
        </CreateCompetition>
        <Link to={'/competition/123'} className=" bg-sidebar cursor-pointer group h-[200px] flex flex-col border border-dashed rounded-md p-1">
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
          <div className="text-muted-foreground flex justify-between overflow-hidden">
            <p className="text-sm relative p-2 py-4 left-[0px] group-hover:left-[-200px]">Updated 2d ago</p>
            <p className="text-sm relative text-white flex p-2 py-4 gap-2 left-[200px] group-hover:left-[0px] items-center">Open Competition <ArrowRight size={14} /> </p>
          </div>
        </Link>
        {/* <UserCompetitionCard
          title="Basic Ethical Hacking Methodologies For Beginners"
          status="Upcoming"
          progress={20}
          ownerName="Nkiko Hertier"
          ownerOrg="AUCA University"
          coverImage="https://picsum.photos/400/200"
          ownerImage="https://i.pravatar.cc/100"
        />
        <UserCompetitionCard
          title="Basic Ethical Hacking Methodologies For Beginners"
          status="Upcoming"
          progress={20}
          ownerName="Nkiko Hertier"
          ownerOrg="AUCA University"
          coverImage="https://picsum.photos/400/200"
          ownerImage="https://i.pravatar.cc/100"
        />
        <UserCompetitionCard
          title="Basic Ethical Hacking Methodologies For Beginners"
          status="Upcoming"
          progress={20}
          ownerName="Nkiko Hertier"
          ownerOrg="AUCA University"
          coverImage="https://picsum.photos/400/200"
          ownerImage="https://i.pravatar.cc/100"
        /> */}
      </div>
    </div>
  );
}
