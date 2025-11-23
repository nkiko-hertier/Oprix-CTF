import React from "react";
import { Trophy, Timer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientCard } from "./HomeCards";
import type { ChallengeDifficulty } from "@/types";

interface ChallengeCardProps {
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  points: number;
  timeLimit?: number | null;
  isSolved?: boolean;
  onStart?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  description,
  difficulty,
  points,
  timeLimit,
  onStart,
  isSolved
}) => {
  const difficultyColor = "text-red-400"
    // difficulty === "Easy"
    //   ? "text-green-400"
    //   : difficulty === "Medium"
    //   ? "text-yellow-400"
    //   : "text-red-400";

  return (
    <GradientCard className="min-h-fit p-4 flex flex-col justify-between space-y-3">
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-slate-300 text-sm">{description}</p>
      </div>

      <div className="flex justify-between items-center border-t border-dashed border-slate-700 pt-3 text-sm">
        <div className="flex items-center gap-4">
          <span className={`font-semibold ${difficultyColor}`}>
            {difficulty}
          </span>
          <div className="flex items-center gap-1 text-slate-300">
            <Trophy size={16} /> {points} pts
          </div>
          {timeLimit && (
            <div className="flex items-center gap-1 text-slate-300">
              <Timer size={16} /> {timeLimit}
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onStart}
          className="flex items-center gap-1"
        >
          <ArrowRight size={16} /> {isSolved ? "(Solved)" : "Solve"}
        </Button>
      </div>
    </GradientCard>
  );
};

export default ChallengeCard;
