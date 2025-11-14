'use client';

import { useState, useEffect } from 'react';
import ChallengeCard from '../ChallengeCard';
import ChallengePopup from '../ChallengePopup';
import { API_ENDPOINTS } from '@/config/api.config';
import getApiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { Challenge } from '@/types';

interface ChallangesProps {
  competitionId: string;
}

const Challanges = ({ competitionId }: ChallangesProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (id: string) => {
    setSelected(id);
    setOpen(true);
  };

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await getApiClient().get(
        API_ENDPOINTS.CHALLENGES.LIST(competitionId)
      );
      setChallenges(res.data);
    } catch (error: any) {
      toast.error('Failed to load challenges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (competitionId) fetchChallenges();
  }, [competitionId]);

  if (loading) return (
    <div>
      <div className='skeleton w-[100px]! h-[30px]!'></div>
      <div className='mt-3 space-y-2'>
        <div className='skeleton h-[100px]!'></div>
        <div className='skeleton h-[100px]!'></div>
        <div className='skeleton h-[100px]!'></div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold">Challenges</h2>
      <div className="mt-5 space-y-2">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            title={challenge.title}
            description={challenge.description}
            difficulty={challenge.difficulty}
            points={challenge.points}
            timeLimit={challenge.timeLimit}
            onStart={() => handleOpen(challenge.id)}
            isSolved={challenge.isSolved}
          />
        ))}
      </div>

      <ChallengePopup
        challengeId={selected}
        competitionId={competitionId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Challanges;
