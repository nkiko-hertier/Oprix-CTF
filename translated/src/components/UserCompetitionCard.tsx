import React from "react";

interface CompetitionCardProps {
  title: string;
  status: "Upcoming" | "Completed" | "Started" | "Pending";
  progress: number; // percentage (0–100)
  ownerName: string;
  ownerOrg: string;
  coverImage?: string;
  ownerImage?: string;
}

const statusColors: Record<CompetitionCardProps["status"], string> = {
  Upcoming: "bg-blue-500/10 text-blue-500",
  Completed: "bg-green-500/10 text-green-500",
  Started: "bg-yellow-500/10 text-yellow-500",
  Pending: "bg-red-500/10 text-red-500",
};

export const UserCompetitionCard: React.FC<CompetitionCardProps> = ({
  title,
  status,
  progress,
  ownerName,
  ownerOrg,
  coverImage,
  ownerImage,
}) => {
  return (
    <div className="bg-card cursor-pointer text-card-foreground shadow-2xl shadow-zinc-500/10 p-3 rounded-md">
      {/* Cover */}
      <div className="cover bg-slate-500/15 w-full h-[150px] rounded-md overflow-hidden">
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Status */}
      <div
        className={`${statusColors[status]} text-sm p-1 px-2 rounded-full w-fit my-1 mt-2`}
      >
        {status}
      </div>

      {/* Title */}
      <h1 className="font-semibold">{title}</h1>

      {/* Progress Bar */}
      <div className="main-stick h-2 bg-accent rounded-full mt-3">
        <div
          className="h-full bg-blue-500 rounded-2xl"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Creator / Owner */}
      <div className="flex items-center gap-2 mt-3 mb-3">
        <div className="bg-slate-500/10 size-10 rounded-full overflow-hidden">
          {ownerImage && (
            <img
              src={ownerImage}
              alt={ownerName}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="font-semibold">{ownerName}</h1>
          <p className="text-sm text-muted-foreground">{ownerOrg}</p>
        </div>
      </div>
    </div>
  );
};
