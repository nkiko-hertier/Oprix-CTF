"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, Timer, Globe, Folder } from "lucide-react";
import { GradientCard } from "./HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";

interface Challenge {
    id: string;
    title: string;
    description: string;
    category?: string;
    points: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    solveCount: number;
    timeLimit?: number;
    url?: string;
    files?: { id: string; name: string; url: string }[];
}

interface ChallengePopupProps {
    challengeId: string | null;
    competitionId: string;
    open: boolean;
    onClose: () => void;
}

const ChallengePopup: React.FC<ChallengePopupProps> = ({ challengeId, open, onClose, competitionId }) => {
    const [loading, setLoading] = useState(true);
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [flag, setFlag] = useState("");

    // 🔥 Fetch real challenge from API
    const fetchChallenge = async () => {
        if (!challengeId) return;

        try {
            setLoading(true);

            const res = await getApiClient().get(
                API_ENDPOINTS.CHALLENGES.GET(competitionId, challengeId)
            );

            setChallenge(res.data);
        } catch (error: any) {
            toast.error("Failed to load challenge details");
            setChallenge(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (challengeId) fetchChallenge();
    }, [challengeId]);

    // 🔥 Flag submission handler
    const submitFlag = async () => {
        if (!flag.trim()) return toast.warning("Flag cannot be empty.");

        try {
            setSubmitting(true);

            const res = await getApiClient().post(
                API_ENDPOINTS.SUBMISSIONS.CREATE,
                { 
                    challengeId,
                    flag
                    // teamId: optional teamId if needed
                }
            );

            toast.success(res.data?.message || "Flag submitted!");
            setFlag("");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid flag");
        } finally {
            setSubmitting(false);
        }
    };

    const difficultyColor =
        challenge?.difficulty === "EASY"
            ? "text-green-400"
            : challenge?.difficulty === "MEDIUM"
                ? "text-yellow-400"
                : "text-red-400";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0! bg-slate-900 rounded-md border-none">
                <GradientCard className="p-6">
                    <DialogHeader>
                        <DialogTitle className="flex justify-between items-center">
                            <span>{challenge ? challenge.title : "Loading..."}</span>
                        </DialogTitle>
                    </DialogHeader>

                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : challenge ? (
                        <GradientCard className="p-4 space-y-4 mt-5">

                            <p className="text-slate-300">{challenge.description}</p>

                            {/* 🔗 Challenge URL */}
                            {challenge.url && (
                                <a
                                    href={challenge.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-400 hover:underline text-sm"
                                >
                                    <Globe size={16} /> Access Challenge
                                </a>
                            )}

                            {/* 📎 Attached Files */}
                            {challenge.files && challenge.files.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-1">Attached Files:</p>
                                    <ul className="text-sm space-y-1">
                                        {challenge.files.map((file) => (
                                            <li key={file.id}>
                                                <a
                                                    href={file.url}
                                                    className="flex items-center gap-2 text-slate-300 hover:text-blue-400"
                                                >
                                                    <Folder size={14} /> {file.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex items-center justify-between border-t border-dashed border-slate-700 pt-3 text-sm">
                                <div className="flex flex-wrap items-center gap-4 text-slate-400">
                                    <span className={`font-semibold ${difficultyColor}`}>
                                        {challenge.difficulty}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Trophy size={16} /> {challenge.points} pts
                                    </div>
                                    {challenge.timeLimit && (
                                        <div className="flex items-center gap-1">
                                            <Timer size={16} /> {challenge.timeLimit} min
                                        </div>
                                    )}
                                    {challenge.category && <span>🏷 {challenge.category}</span>}
                                </div>

                                <Button size="sm" variant="secondary">
                                    Start Challenge
                                </Button>
                            </div>

                            {/* 🏁 Flag submission */}
                            <div>
                                <div className="flex bg-slate-300/10 p-2 rounded-md">
                                    <input
                                        type="text"
                                        value={flag}
                                        onChange={(e) => setFlag(e.target.value)}
                                        className="w-full px-3 outline-none bg-transparent text-white"
                                        placeholder="Oprix-{myFlagHere}"
                                    />
                                    <button
                                        className="bg-blue-500 p-2 rounded-md text-sm px-5"
                                        onClick={submitFlag}
                                        disabled={submitting}
                                    >
                                        {submitting ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                            </div>

                        </GradientCard>
                    ) : (
                        <p className="text-center text-slate-400 py-10">Challenge not found.</p>
                    )}
                </GradientCard>
            </DialogContent>
        </Dialog>
    );
};

export default ChallengePopup;
