"use client"
import { useParams } from 'react-router-dom';
import { BsStars } from 'react-icons/bs';
import CompetitionPage from '@/components/CompetitonsPages';
import type { Competition } from '@/types';
import { useEffect, useState } from 'react';
import getApiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import CompetionsPageSkeleton from '@/components/CompetionsPageSkeleton';



function SingleCompetitionsPage() {
    
    const params = useParams();
    const competitionId: string = params.id || '';
    const [competition, setCompetition] = useState<Competition | null>(null);

    useEffect(() => {
        getApiClient().get(API_ENDPOINTS.COMPETITIONS.GET(competitionId))
        .then((res) => setCompetition(res.data));
    }, [competitionId]);

    if (!competition) {
        return <CompetionsPageSkeleton />
    }

    return (
        <div>
            <div className='h-[300px] relative mb-2'>
                <button className='absolute top-6 right-6 bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20 flex gap-2 items-center'><BsStars /> Beginner</button>
                <div className='bg-linear-to-t from-black rounded-md absolute size-full p-4 flex flex-col justify-end'>
                    <h1 className='text-2xl'>{competition.name}</h1>
                    <p className='text-zinc-500'>
                        Hosted by Oprix CTF | Starts on {new Date(competition.createdAt).toLocaleDateString()} | Ends on {new Date(competition.endTime).toLocaleDateString()}
                    </p>
                </div>
                <img src="https://cdn.pixabay.com/collection/thumbnail/2025/06/05/island-2722471_1280.jpg" className='rounded-md size-full object-cover' alt="" />
            </div>
            <CompetitionPage competition={competition} />
        </div>
    )
}

export default SingleCompetitionsPage