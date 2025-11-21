"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, Timer, Globe, Folder, Download, Lock, Unlock, Lightbulb, AlertCircle } from "lucide-react";
import { GradientCard } from "./HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import type { Hint, FileRecord } from "@/types";

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
    hints?: Hint[];
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
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [unlockingHint, setUnlockingHint] = useState<string | null>(null);

    // 🔥 Fetch real challenge from API
    const fetchChallenge = async () => {
        if (!challengeId) return;

        try {
            setLoading(true);

            const res = await getApiClient().get(
                API_ENDPOINTS.CHALLENGES.GET(competitionId, challengeId)
            );

            setChallenge(res.data);
            
            // Fetch files separately
            fetchFiles();
        } catch (error: any) {
            toast.error("Failed to load challenge details");
            setChallenge(null);
        } finally {
            setLoading(false);
        }
    };

    // Fetch challenge files
    const fetchFiles = async () => {
        if (!challengeId) return;

        try {
            setLoadingFiles(true);
            const res = await getApiClient().get(
                API_ENDPOINTS.FILES.GET_CHALLENGE(challengeId)
            );
            setFiles(res.data || []);
        } catch (error: any) {
            // Files might not exist, don't show error
            console.error("Failed to load files:", error);
        } finally {
            setLoadingFiles(false);
        }
    };

    // Download file handler
    const handleDownloadFile = async (fileName: string, originalName: string) => {
        try {
            const apiClient = getApiClient();
            const response = await apiClient.get(
                API_ENDPOINTS.FILES.DOWNLOAD(fileName),
                { responseType: 'blob' }
            );

            // Create blob and download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalName || fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("File downloaded successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to download file");
        }
    };

    // Unlock hint handler
    const handleUnlockHint = async (hintId: string) => {
        if (!challengeId) return;

        try {
            setUnlockingHint(hintId);
            const res = await getApiClient().post(
                API_ENDPOINTS.CHALLENGES.UNLOCK_HINT(competitionId, challengeId, hintId)
            );

            toast.success(res.data?.message || "Hint unlocked!");
            
            // Refresh challenge to get updated hints
            await fetchChallenge();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to unlock hint");
        } finally {
            setUnlockingHint(null);
        }
    };

    useEffect(() => {
        if (challengeId && open) {
            fetchChallenge();
        }
    }, [challengeId, open]);

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
                            {(files.length > 0 || loadingFiles) && (
                                <div>
                                    <p className="font-semibold mb-2 flex items-center gap-2">
                                        <Folder size={16} />
                                        Attached Files:
                                    </p>
                                    {loadingFiles ? (
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <Loader2 className="size-4 animate-spin" />
                                            Loading files...
                                        </div>
                                    ) : (
                                        <ul className="text-sm space-y-2">
                                            {files.map((file) => (
                                                <li key={file.id}>
                                                    <button
                                                        onClick={() => handleDownloadFile(file.fileName, file.fileName)}
                                                        className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors w-full text-left"
                                                    >
                                                        <Download size={14} />
                                                        <span>{file.fileName}</span>
                                                        {file.fileSize && (
                                                            <span className="text-xs text-slate-500 ml-auto">
                                                                {(file.fileSize / 1024).toFixed(2)} KB
                                                            </span>
                                                        )}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* 💡 Hints Section */}
                            {challenge.hints && challenge.hints.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-2 flex items-center gap-2">
                                        <Lightbulb size={16} />
                                        Hints:
                                    </p>
                                    <div className="space-y-2">
                                        {challenge.hints.map((hint) => (
                                            <div
                                                key={hint.id}
                                                className={`p-3 rounded-md border ${
                                                    hint.isUnlocked
                                                        ? "bg-green-500/10 border-green-500/50"
                                                        : "bg-slate-800/50 border-slate-700"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {hint.isUnlocked ? (
                                                            <Unlock className="size-4 text-green-400" />
                                                        ) : (
                                                            <Lock className="size-4 text-slate-400" />
                                                        )}
                                                        <span className="text-sm font-medium text-slate-300">
                                                            Hint {hint.order}
                                                        </span>
                                                        {!hint.isUnlocked && hint.cost > 0 && (
                                                            <span className="text-xs text-yellow-400">
                                                                ({hint.cost} pts)
                                                            </span>
                                                        )}
                                                    </div>
                                                    {!hint.isUnlocked && (
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm(
                                                                    `Unlock this hint for ${hint.cost} points?`
                                                                )) {
                                                                    handleUnlockHint(hint.id);
                                                                }
                                                            }}
                                                            disabled={unlockingHint === hint.id}
                                                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                        >
                                                            {unlockingHint === hint.id ? (
                                                                <>
                                                                    <Loader2 className="size-3 animate-spin" />
                                                                    Unlocking...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Unlock className="size-3" />
                                                                    Unlock
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                                {hint.isUnlocked && (
                                                    <p className="text-sm text-slate-300 mt-2 ml-6">
                                                        {hint.content}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
