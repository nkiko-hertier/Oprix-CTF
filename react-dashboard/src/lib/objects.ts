export const ctfReviews = [
  {
    id: 1,
    name: "Alex 'Root' Chen",
    username: "Rootkit",
    imageUrl: "/avatars/root.jpg", // Placeholder image path
    reviewContent:
      "This platform is a goldmine for anyone serious about security. The difficulty scaling is perfect for both newcomers and seasoned hackers. Top-notch challenges!",
    imageAlt: "Alex Chen's profile picture",
  },
  {
    id: 2,
    name: "Nkiko Hertier",
    username: "snaow",
    imageUrl: "/avatars/nkiko.jpg", // Placeholder image path
    reviewContent:
      "The most powerful CTF platform that cares for both beginners and advanced developers. The community forums are incredibly helpful.",
    imageAlt: "Nkiko Hertier's profile picture",
  },
  {
    id: 3,
    name: "Maya Varma",
    username: "NetRunner",
    imageUrl: "/avatars/maya.jpg", // Placeholder image path
    reviewContent:
      "Amazing experience! The Web Exploitation and Reversing challenges are particularly well-designed. I use this for all my interview prep.",
    imageAlt: "Maya Varma's profile picture",
  },
];

import { Users2, Zap, Trophy, TrendingUp } from "lucide-react";

export const ctfFeatures = [
  {
    id: 1,
    metric: "10k +",
    label: "Registered Hackers",
    Icon: Users2,
    iconColorClass: "text-cyan-400",
  },
  {
    id: 2,
    metric: "500 +",
    label: "Challenges Available",
    Icon: Trophy,
    iconColorClass: "text-yellow-400",
  },
  {
    id: 3,
    metric: "99.9%",
    label: "Platform Uptime",
    Icon: Zap,
    iconColorClass: "text-indigo-400",
  },
  {
    id: 4,
    metric: "100%",
    label: "Beginner-Friendly",
    Icon: TrendingUp,
    iconColorClass: "text-lime-400",
  },
];


import { useEffect, useState } from 'react';

export const useSubmissionCountdown = (message?: string) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // seconds

  useEffect(() => {
    if (!message) return;

    // Only run if the message is about timeout
    const regex = /Please wait (\d+) minutes/;
    const match = message.match(regex);
    if (!match) return;

    const minutes = parseInt(match[1], 10);
    let remaining = minutes * 60; // convert to seconds
    setTimeLeft(remaining);

    const interval = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [message]);

  // Format as MM:SS
  const formattedTime = timeLeft !== null
    ? new Date(timeLeft * 1000).toISOString().substr(14, 5)
    : null;

  return formattedTime;
};
