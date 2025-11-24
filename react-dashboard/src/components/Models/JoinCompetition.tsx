'use client';

import { useEffect, useState } from 'react';
import type { Competition, PaginatedResponse } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FaRegCalendarTimes, FaBusinessTime } from 'react-icons/fa';
import { BsFillTrophyFill } from 'react-icons/bs';
import { PiUsersThreeFill } from 'react-icons/pi';
import { API_ENDPOINTS } from '@/config/api.config';
import getApiClient from '@/lib/api-client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { CompButtonText } from '@/lib/utils';

interface JoinCompetitionProps {
    competition: Competition;
    isReged?: boolean
}

interface JoinPayload {
    teamId?: string;
}

export const JoinCompetition = ({ competition, isReged = false }: JoinCompetitionProps) => {
    const [teamId, setTeamId] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMember, setIsMember] = useState(false);

    const [teamName, setTeamName] = useState('');
    const [teamDescription, setTeamDescription] = useState('');
    const [maxSize, setMaxSize] = useState(4); // default max team size
    const [inviteCode, setInviteCode] = useState('');
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);



    const handleJoinWithCode = async () => {
        if (!inviteCode) return toast.warning("Please enter an invitation code.");
        setLoading(true);

        try {
            const res = await getApiClient().post(
                '/teams/join', // or API_ENDPOINTS.TEAMS.JOIN
                { inviteCode }
            );
            toast.success(res.data.message || "Joined team successfully!");
            setIsMember(true);
            setJoinDialogOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to join team.");
        } finally {
            setLoading(false);
        }
    };


    const handleCreateTeam = async () => {
        if (!teamName) return toast.warning("Please enter a team name.");
        setLoading(true);

        try {
            const res = await getApiClient().post(
                '/teams', // or API_ENDPOINTS.TEAMS.CREATE
                {
                    name: teamName,
                    description: teamDescription,
                    maxSize,
                    competitionId: competition.id
                }
            );

            // After creating, automatically join the team
            setTeamId(res.data.id);
            await handleJoin(); // reuse your existing join function
            setCreateDialogOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create team.");
        } finally {
            setLoading(false);
        }
    };





    const checkRegistration = async () => {
        try {
            const isReged = await getApiClient().get(
                API_ENDPOINTS.COMPETITIONS.GET(competition.id)
            );
            setIsMember(isReged.data.isRegistered);
            // (isReged.data.isRegistered) && toast.message("You or your team is already registered for this competition.");
        } catch (error) {
            toast.error("Something went wrong while checking registration status.");
            setLoading(false);
            return;
        }
    }

    const handleJoin = async () => {
        setLoading(true);
        const payload: JoinPayload = competition.isTeamBased ? { teamId } : {};

        try {
            const res = await getApiClient().post(
                API_ENDPOINTS.COMPETITIONS.REGISTER(competition.id),
                payload && payload
            );

            toast.success(res.data.message[0]);
            location.href = `/platform/competition/${competition.id}#challanges`;
            setLoading(false);
        } catch (error: any) {
            console.error(error)
            if (error.response?.status === 409) {
                toast.warning("You or your team is already registered for this competition.");
                setLoading(false);
            } else {
                location.href = `/platform/competition/${competition.id}#challanges`;
                toast.error(error.response?.data?.message || "Something went wrong.");
                setLoading(false);
            }
        }
    };


    return (
        <>
            <Dialog
                onOpenChange={(open) => {
                    if (open) checkRegistration();
                }}
            >
                <DialogTrigger asChild>
                    <Button>View Competition</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-[#1b1d21] border-none">
                    <DialogHeader>
                        <DialogTitle>{competition.name}</DialogTitle>
                        <DialogDescription>
                            {competition.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2 py-4 grid-cols-2 bg-white/10 p-3 rounded-md">
                        <p className='text-zinc-400'><strong className='flex text-white gap-2 items-center'><FaRegCalendarTimes />Start:</strong> {new Date(competition.startTime).toLocaleString()}</p>
                        <p className='text-zinc-400'><strong className='flex text-white gap-2 items-center'><FaBusinessTime /> End:</strong> {new Date(competition.endTime).toLocaleString()}</p>
                        <p className='text-zinc-400'><strong className='flex text-white gap-2 items-center'><BsFillTrophyFill />  Prize:</strong> {competition.prize ?? "Completation Certificate"}</p>
                        <p className='text-zinc-400'><strong className='flex text-white gap-2 items-center'><PiUsersThreeFill /> Participants:</strong> {competition._count.registrations}</p>
                    </div>

                    {(competition.isTeamBased && competition.status == "REGISTRATION_OPEN") && (
                        <div className="grid bg-white/10 p-3 py-6 rounded-md">
                            <div className='mb-5'>
                                <h1 className='text-center text-xl'>You Need a team to join</h1>
                                <p className='text-center text-zinc-400'>join by invitation code or create a new team</p>
                            </div>
                            <div className='flex justify-center gap-2'>
                                <Button onClick={() => setJoinDialogOpen(true)}>Join existing</Button>
                                <Button onClick={() => setCreateDialogOpen(true)}>Create new</Button>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        {isMember ? <p className='text-zinc-500'>You are already registered for this competition.</p> : null}
                        {
                            (competition.status !== 'REGISTRATION_OPEN') ?
                                <Button asChild>
                                    <Link to={`/platform/competition/${competition.id}`}>
                                        {CompButtonText[competition.status] || "View Competition"}
                                    </Link>
                                </Button>
                                :
                                ((!isMember && !isReged) ?
                                    (<Button onClick={handleJoin} disabled={loading || (competition.isTeamBased && !teamId)}>
                                        {loading ? 'Joining...' : 'Join'}
                                    </Button>) :
                                    <Button asChild>
                                        <Link to={`/platform/competition/${competition.id}#challanges`}>
                                            Continue Solving
                                        </Link>
                                    </Button>
                                )
                        }
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Join Existing Team */}
            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Join Existing Team</DialogTitle>
                        <DialogDescription>Enter your team's invitation code</DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="Invitation Code"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                    />
                    <DialogFooter>
                        <Button onClick={handleJoinWithCode} disabled={loading}>
                            {loading ? "Joining..." : "Join Team"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create New Team */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                        <DialogDescription>Enter your team details</DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="Team Name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="mb-2"
                    />
                    <Input
                        placeholder="Description"
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        className="mb-2"
                    />
                    <Input
                        type="number"
                        placeholder="Max Size"
                        value={maxSize}
                        onChange={(e) => setMaxSize(Number(e.target.value))}
                        className="mb-2"
                    />
                    <DialogFooter>
                        <Button onClick={handleCreateTeam} disabled={loading}>
                            {loading ? "Creating..." : "Create Team"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    );
};
