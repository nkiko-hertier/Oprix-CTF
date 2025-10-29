import { cn } from '@/lib/utils'
import React from 'react'

interface LeaderboardProps {
  activeTab: string;
}

function Leaderboard({activeTab}: LeaderboardProps) {
  return (
    <div className={cn("", activeTab == 'Leaderboard' ? 'block' : 'hidden')}>Leaderboard</div>
  )
}

export default Leaderboard