"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { triggerSideCannons } from "@/lib/confetti";
import { Button } from "@/components/ui/button";
import getApiClient from "@/lib/api-client";

type StatusItem = {
  progress: number;
  message: string;
  description: string;
  illustration?: string; // optional image/svg
};

const STATUS_MESSAGES: StatusItem[] = [
  {
    progress: 0,
    message: "Let's Begin! 🚀",
    description: "You haven't started yet. Ready to take on the challenge?",
    illustration: "https://cdn3d.iconscout.com/3d/premium/thumb/celebrate-emoji-3d-icon-png-download-7151071.png",
  },
  {
    progress: 50,
    message: "Halfway There! ✨",
    description: "Great work! Keep pushing, you're doing amazing.",
    illustration: "/illustrations/halfway.svg",
  },
  {
    progress: 99,
    message: "Almost Done! 🔥",
    description: "Just one final push. You got this!",
    illustration: "/illustrations/almost.svg",
  },
  {
    progress: 100,
    message: "Congratulations! 🎉",
    description: "You completed this competition successfully!",
    illustration: "https://cdnai.iconscout.com/ai-image/premium/thumb/ai-girl-holding-award-3d-illustration-png-download-jpg-13253664.png",
  },
];

interface CompetitionStatusModalProps {
  competitionId: string;
  open: boolean;
  onClose: () => void;
}

export function     CompetitionStatusModal({
  competitionId,
  open,
  onClose,
}: CompetitionStatusModalProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<StatusItem | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchStatus = async () => {
      try {
        const res = await getApiClient().get(`/competitions/${competitionId}/progress`);
        const userProgress = parseFloat(res.data.progress); // assuming API returns { progress: number }
        
        console.log(res.data)

        setProgress(userProgress);

        // pick closest progress milestone
        const matchedStatus =
          STATUS_MESSAGES.find((item) => userProgress <= item.progress) ||
          STATUS_MESSAGES[0];

        setStatus(matchedStatus);

        // trigger confetti if completed
        if (userProgress >= 100) {
          triggerSideCannons();
        }
      } catch (err) {
        console.error("Failed to fetch competition progress:", err);
      }
    };

    fetchStatus();
  }, [open, competitionId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl bg-sidebar p-6 text-center space-y-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold hidden">
            {status?.message || "Loading..."}
          </DialogTitle>
        </DialogHeader>

        {/* 🌀 Placeholder for animated SVG or Lottie */}
        <div className="w-full h-40 flex items-center justify-center">
          {status?.illustration ? (
            <img
              src={status.illustration}
              alt="Status Illustration"
              className="h-full object-contain"
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              [ Animated SVG goes here ]
            </div>
          )}
        </div>

        <div>

        <h1 className="text-2xl font-bold">
            {status?.message || "Loading..."}
          </h1>

        <p className="text-muted-foreground">{status?.description}</p>
        </div>

        {/* action button */}
        <div className="pt-4">
          <Button onClick={onClose} className="w-full">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
