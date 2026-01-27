import { API_ENDPOINTS } from '@/config/api.config'
import getApiClient from '@/lib/api-client'
import React, { useEffect, useState } from 'react'
import type { Competition, LeaderboardEntry } from '@/types'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { formatTimeAgoOrRemaining } from '@/lib/utils'
import NoContent from '@/components/NoContent'

function getRankIcon(rank: number): React.ReactNode {
    switch (rank) {
      case 1:
        return <span className="text-yellow-400 font-bold">🥇</span>
      case 2:
        return <span className="text-gray-300 font-bold">🥈</span>
      case 3:
        return <span className="text-amber-600 font-bold">🥉</span>
      default:
        return <span>{rank}</span>
    }
  }

function CompetitionById() {
    const [competitions, setCompetitions] = useState<Competition | null>(null)

    const [loading, setLoading] = useState(true);
    const [individualLeaderboard, setIndividualLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const { id } = useParams()

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);

            const res = await getApiClient().get(API_ENDPOINTS.LEADERBOARD.COMPETITION(id ?? ''));
            setIndividualLeaderboard(res.data || []);
           
        } catch (error) {
            toast.error("Failed to load leaderboard");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchLeaderboard();
      }, [id]);

    const fetchCompetitons = async () => {
        setIsLoading(true)
        const data = await getApiClient().get(API_ENDPOINTS.COMPETITIONS.GET(id ?? 'fake'));
        setCompetitions(data.data)
        setIsLoading(false)
        return data.data
    }
    useEffect(() => {
        fetchCompetitons()
    }, [])

    return (
        <div className='w-[80%] mx-auto'>
            <div className='h-[200px] bg-slate-800 rounded-md overflow-hidden relative'>
                <img src="https://cdn.pixabay.com/photo/2017/02/09/15/10/sea-2052650_1280.jpg" className='object-center object-cover size-full' alt="Dolphine in the sea" />
                <div className='absolute size-full bg-linear-to-t from-slate-900 to-transparent top-0'></div>
            </div>
            {competitions ? (
                <>
                <h1 className='text-xl mt-3'>
                    {competitions.name}
                </h1>
                <p className='text-slate-400'>{competitions.description}</p>
                <div className='flex gap-2 flex-wrap mt-3'>
                    <span className='bg-slate-800 px-3 p-1 text-sm rounded-sm'>Start {competitions.startTime}</span>
                    <span className='bg-slate-800 px-3 p-1 text-sm rounded-sm'>End {competitions.endTime}</span>
                </div>
                </>
            ) : (
                <div className='mt-3'>Loading competition details...</div>
            )}

            <div className='mt-5'>
                <h1 className='text-xl'>Leaderboard</h1>
                <p className='text-slate-400'>View scores for this competition</p>
            </div>

            <div>
            {individualLeaderboard.length === 0 ? (
            <NoContent title="No rankings yet" description="Be the first to solve a challenge!" />
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-800 text-slate-300 text-sm">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Solved</th>
                    <th className="p-3">Last Submission</th>
                  </tr>
                </thead>

                <tbody>
                  {individualLeaderboard.map((entry) => (
                    <tr
                      key={entry.userId}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="p-3">{getRankIcon(entry.rank)}</td>

                      <td className="p-3 flex items-center gap-2">
                        {entry.avatarUrl && (
                          <img src={entry.avatarUrl} className="size-7 rounded-full" />
                        )}
                        <span>{entry.username}</span>
                      </td>

                      <td className="p-3 font-semibold">{entry.totalPoints}</td>

                      <td className="p-3">{entry.solvedCount}</td>

                      <td className="p-3 text-xs">
                        {formatTimeAgoOrRemaining(entry.lastSolveTime || "")}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
            </div>
        </div>
    )
}

export default CompetitionById