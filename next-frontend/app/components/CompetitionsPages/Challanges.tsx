import React, { useState } from 'react'
import { GradientCard } from '../HomeCards'
import ChallengeCard from '../ChallengeCard'
import { challenges } from '@/lib/damie/damie_challanges'
import ChallengePopup from '../ChallengePopup';

function Challanges(id: {id: any}) {
   const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (id: string) => {
    setSelected(id);
    setOpen(true);
  };
  return (
    <div>
      Challanges
      <div className="mt-5 space-y-2">
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={index}
            title={challenge.title}
            description={challenge.description}
            difficulty={challenge.difficulty}
            points={challenge.points}
            timeLimit={challenge.timeLimit}
            onStart={() => handleOpen('2')}
          />
        ))}
      </div>
      <ChallengePopup challengeId={selected} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default Challanges