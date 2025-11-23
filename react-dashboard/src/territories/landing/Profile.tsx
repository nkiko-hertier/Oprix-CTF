"use client";

import React, { useEffect, useState } from "react";
import { MdPerson, MdEmail, MdLocationOn, MdLanguage, MdLink, MdPublic, MdInfo, MdEmojiEvents, MdGroups, MdTrackChanges, MdTrendingUp } from "react-icons/md";
import { FaLinkedinIn, FaGithub, FaGlobe } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";

interface ProfileData {
    firstName: string;
    lastName: string;
    bio: string;
    avatarUrl?: string;
    country?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    skills?: string[];
}

interface UserData {
    username: string;
    email?: string;
    profile: ProfileData;
}

interface StatsData {
    totalPoints: number;
    totalScoresRecorded: number;
    totalSubmissions: number;
    solvedChallenges: number;
    participatedCompetitions: number;
}

const Profile = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { id } = useParams();

    const endpoint =
        `https://oprix-api.up.railway.app/api/v1/users/${id}/profile`;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(endpoint);
                if (res.data.success) {
                    setUser(res.data.user);
                    setStats(res.data.stats);
                } else {
                    setError("Failed to load profile.");
                }
            } catch (err) {
                setError("An error occurred while fetching profile.");
                location.href = '/'
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading)
        return <p className="text-center mt-10 text-gray-300">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!user) return null;

    const { profile, username, email } = user;

    return (
        <div className="space-y-6 w-[90%] mx-auto py-6">
            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg bordesr border-white/20 p-6">
                {/* Left: Profile Info */}
                <div className="flex-1">
                    <div className="flex items-start md:items-center gap-4">
                        {/* Avatar */}
                        {profile.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt={`${profile.firstName} ${profile.lastName}`}
                                className="w-20 h-20 rounded-full border-2 border-white/20 object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-white/20">
                                <MdPerson className="w-10 h-10 text-blue-400" />
                            </div>
                        )}

                        {/* Name & Username */}
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {profile.firstName} {profile.lastName}
                            </h1>
                            <p className="text-gray-400">@{username}</p>
                            {email && (
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                                    <MdEmail className="w-4 h-4" />
                                    {email}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <p className="mt-4 text-gray-300">
                            {profile.bio}
                        </p>
                    )}

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-4">
                        {profile.linkedin && (
                            <a
                                href={
                                    profile.linkedin.startsWith("http")
                                        ? profile.linkedin
                                        : `https://linkedin.com/in/${profile.linkedin}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <FaLinkedinIn size={15} />
                                <p>LinkedIn</p>
                            </a>
                        )}
                        {profile.github && (
                            <a
                                href={
                                    profile.github.startsWith("http")
                                        ? profile.github
                                        : `https://github.com/${profile.github}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <FaGithub size={15} />
                                <p>Github</p>
                            </a>
                        )}
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <FaGlobe size={15} />
                                <p>Website</p>
                            </a>
                        )}
                    </div>

                    {/* Skills */}
                    {profile.skills && profile.skills.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="mt-5 text-lg">User Stats</h1>
                    <hr className="mt-2" />
                </div>

                {/* Right: Stats */}
                {stats && (
                    <div className="flex-1 grid grid-cols-2 gap-3 md:grid-cols-4 mt-5">

                        <div className="bg-yellow-500/10 p-4 rounded-lg borders border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <MdEmojiEvents className="text-yellow-500 w-5 h-5" />
                                <span className="text-sm text-gray-400">Points</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{stats.totalPoints}</div>
                        </div>

                        <div className="bg-green-500/10 p-4 rounded-lg borders border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <MdTrackChanges className="text-green-500 w-5 h-5" />
                                <span className="text-sm text-gray-400">Solved Challenges</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{stats.solvedChallenges}</div>
                        </div>

                        <div className="bg-blue-500/10 p-4 rounded-lg borders border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <MdTrendingUp className="text-blue-500 w-5 h-5" />
                                <span className="text-sm text-gray-400">Winning Rate</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{((stats.totalScoresRecorded / stats.totalSubmissions) * 100).toFixed(1)}%</div>
                        </div>

                        <div className="bg-pink-500/10 p-4 rounded-lg borders border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <MdGroups className="text-pink-500 w-5 h-5" />
                                <span className="text-sm text-gray-400">Competitions</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{stats.participatedCompetitions}</div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile;
