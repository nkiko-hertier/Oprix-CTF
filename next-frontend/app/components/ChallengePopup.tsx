"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, Timer, X, Globe, Folder } from "lucide-react";
import { GradientCard } from "./HomeCards";

interface Challenge {
    id: string;
    title: string;
    description: string;
    category?: string;
    points: number;
    flagHash: string;
    caseSensitive: boolean;
    normalizeFlag: boolean;
    competitionId: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    solveCount: number;
    maxAttempts?: number;
    timeLimit?: number;
    isActive: boolean;
    isVisible: boolean;
    isDynamic: boolean;
    url?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    files?: { id: string; name: string; url: string }[];
}

interface ChallengePopupProps {
    challengeId: string | null;
    open: boolean;
    onClose: () => void;
}

const ChallengePopup: React.FC<ChallengePopupProps> = ({ challengeId, open, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [challenge, setChallenge] = useState<Challenge | null>(null);

    useEffect(() => {
        if (!challengeId) return;

        const fetchChallenge = async () => {
            try {
                setLoading(true);

                // 🔹 TEMPORARY DEFAULT MOCK DATA (for testing before API integration)
                const mockChallenges: Challenge[] = [
                    {
                        id: "1",
                        title: "SQL Injection Challenge",
                        description: "Exploit a SQL Injection to dump user credentials from the database.",
                        category: "Web",
                        points: 150,
                        flagHash: "a1b2c3d4e5f6",
                        caseSensitive: false,
                        normalizeFlag: true,
                        competitionId: "comp123",
                        difficulty: "EASY",
                        solveCount: 24,
                        maxAttempts: 5,
                        timeLimit: 30,
                        isActive: true,
                        isVisible: true,
                        isDynamic: false,
                        url: "https://challenge.lab/sql",
                        metadata: { hints: 2 },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        files: [
                            { id: "f1", name: "vuln.sql", url: "/files/vuln.sql" },
                            { id: "f2", name: "db_schema.txt", url: "/files/db_schema.txt" },
                        ],
                    },
                    {
                        id: "2",
                        title: "Reverse Engineering Intro",
                        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia perferendis fugit minima at earum inventore neque alias ea quasi ipsum commodi eligendi rerum, aut voluptas fugiat sint maxime, facere tempore?",
                        category: "Binary",
                        points: 300,
                        flagHash: "b7f1c9d2",
                        caseSensitive: true,
                        normalizeFlag: false,
                        competitionId: "comp123",
                        difficulty: "MEDIUM",
                        solveCount: 10,
                        maxAttempts: 3,
                        timeLimit: 60,
                        isActive: true,
                        isVisible: true,
                        isDynamic: false,
                        url: "https://challenge.lab/rev",
                        metadata: {},
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        files: [{ id: "f1", name: "challenge.bin", url: "/files/challenge.bin" }, { id: "f2", name: "challenge.bin", url: "/files/challenge.bin" }],
                    },
                ];

                // Simulate fetching delay
                await new Promise((res) => setTimeout(res, 800));

                // Replace with real fetch later
                const found = mockChallenges.find((c) => c.id === challengeId);
                setChallenge(found ?? null);
            } catch (error) {
                console.error(error);
                setChallenge(null);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [challengeId]);

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
                            {/* <Button variant="ghost" size="icon" onClick={onClose}>
                                <X size={18} />
                            </Button> */}
                        </DialogTitle>
                    </DialogHeader>

                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : challenge ? (
                        <GradientCard className="p-4 space-y-3 mt-5">
                            <p className="text-slate-300">{challenge.description}</p>

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

                            {challenge.files && challenge.files.length > 0 && (
                                <div className="mt-3">
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
                                    <span className={`font-semibold ${difficultyColor}`}>{challenge.difficulty}</span>
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
                            <div>
                                <div className="flex bg-slate-300/10 p-2 rounded-md">
                                    <input type="text" className="w-full px-3 outline-none" placeholder="something like Oprix-{y0urF1ag}" />
                                    <div>
                                    <button className="bg-blue-500 p-2 rounded-md text-sm px-5">Sumit&nbsp;flag</button>
                                    </div>
                                </div>
                            </div>
                        </GradientCard>
                    ) : (
                        <p className="text-center text-slate-400 py-10">Challenge not found.</p>
                    )}
                </GradientCard>
            </DialogContent>
        </Dialog >
    );
};

export default ChallengePopup;
