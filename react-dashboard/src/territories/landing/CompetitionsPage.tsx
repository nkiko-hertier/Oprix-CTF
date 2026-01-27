import { API_ENDPOINTS } from '@/config/api.config'
import getApiClient from '@/lib/api-client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCompetitons = async () => {
    setIsLoading(true)
    const data = await getApiClient().get(API_ENDPOINTS.COMPETITIONS.LIST);
    setCompetitions(data.data.data)
    setIsLoading(false)
    return data.data.data
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
      <div className='flex justify-between'>
        <div>
          <h1 className='mt-5 text-2xl'>Explore Competitons</h1>
          <p className='text-slate-500'>View all our competitions</p>
        </div>
        <div>
        </div>
      </div>
      
      {
          (isLoading) && 
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-4">
            <div className='skeleton h-[200px]!'></div>
            <div className='skeleton h-[200px]!'></div>
            <div className='skeleton h-[200px]!'></div>
          </div>
        }
      {/* Complete this area plz */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-4">
        {competitions.map((competition) => (
          <Link
            to={`/competitions/${competition.id}`}
            key={competition.id}
            className="bg-slate-900 rounded-lg p-4  transition cursor-pointer"
          >
            {/* Cover */}
            <div className='h-[180px]'>
              <img src="https://cdn.pixabay.com/photo/2017/02/09/15/10/sea-2052650_1280.jpg" className='object-center rounded-md object-cover size-full' alt="Dolphine in the sea" />
            </div>
            {/* Header */}
            <div className="flex justify-between items-start mt-3">
              <h2 className="text-lg font-semibold">
                {competition.name}
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 line-clamp-2">
              {competition.description || 'No description provided'}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-center mt-1 pt-3 ">
              <span className="text-xs text-slate-500">
                By {competition.admin?.username}
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}

export default CompetitionsPage