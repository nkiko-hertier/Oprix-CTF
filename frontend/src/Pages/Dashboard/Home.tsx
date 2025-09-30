import AlertBox from "@/components/AlertBox";
import { UserCompetitionCard } from "@/components/UserCompetitionCard";

export default function DashboardHome() {
  return (
    <div>
      {/* Most recent announcement! */}
      <AlertBox type="Normal" title="Announcement">
        Hi there, hope your day closed greate. welcome back!
      </AlertBox>
      <h1 className="my-4">Competitions</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
      </div>
    </div>
  );
}
