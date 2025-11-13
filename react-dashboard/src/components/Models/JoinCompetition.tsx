'use client';

import { useState } from 'react';
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
import { Label } from '../ui/label';
import { FaRegCalendarTimes, FaBusinessTime } from 'react-icons/fa';
import { BsFillTrophyFill } from 'react-icons/bs';
import { PiUsersThreeFill } from 'react-icons/pi';
import { API_ENDPOINTS } from '@/config/api.config';
import getApiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface JoinCompetitionProps {
    competition: Competition;
}

interface JoinPayload {
    teamId?: string;
}

export const JoinCompetition = ({ competition }: JoinCompetitionProps) => {
    const [teamId, setTeamId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        setLoading(true);
        const payload: JoinPayload = competition.isTeamBased ? { teamId } : {};

        try {
            const res = await getApiClient().post(
                API_ENDPOINTS.COMPETITIONS.REGISTER(competition.id),
                payload && payload
            );
            toast.success(res.data.message[0]);
            setLoading(false);
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.warning("You or your team is already registered for this competition.");
            setLoading(false);
            } else {
                toast.error(error.response?.data?.message || "Something went wrong.");
            setLoading(false);
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Join Competition</Button>
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

                {competition.isTeamBased && (
                    <div className="grid gap-2 py-2">
                        <Label htmlFor="teamId">Team ID</Label>
                        <Input
                            id="teamId"
                            type="text"
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value)}
                            placeholder="Enter your team ID"
                        />
                    </div>
                )}

                <DialogFooter>
                    <Button onClick={handleJoin} disabled={loading}>
                        {loading ? 'Joining...' : 'Join'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
