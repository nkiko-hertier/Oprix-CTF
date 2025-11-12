import type { Competition, PaginatedResponse } from '@/types'
import { BsStars } from 'react-icons/bs'
import { RiSearch2Line } from 'react-icons/ri'

import { useEffect, useState } from 'react'
import getApiClient from '@/lib/api-client'
import { API_ENDPOINTS } from '@/config/api.config';
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function CompetitionPage() {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [myCompetitions, setMyCompetitions] = useState<Competition[]>([]);

    useEffect(() => {
        getApiClient().get<PaginatedResponse<Competition>>(API_ENDPOINTS.COMPETITIONS.LIST).then((res) => {
            setCompetitions(res.data.data)
            console.log(res.data)
        })
        getApiClient().get<PaginatedResponse<Competition>>(API_ENDPOINTS.COMPETITIONS.LIST + "?myCompetitions=true").then((res) => {
            setMyCompetitions(res.data.data)
            console.log(res.data)
        })
    }, [])

    return (
        <div>
            <h1 className='text-2xl mt-5 sm:text-3xl text-center sm:text-left'>Hey 👋 <br /> Its time to grow even stronger?</h1>

            <div>
                {/* Recent courses section */}
                <section className='mx-0! w-full!'>
                    <h2 className='text-xl mb-4 mt-10'>your competitions</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                        {/* Course Card */}
                        {myCompetitions.map((competition) => {
                                if(competition.status == "DRAFT") return
                                const status = (competition.status == "REGISTRATION_OPEN") ? "OPEN" : competition.status;
                                return (
                                <div className='bg-white/10 p-4 relative rounded-lg hover:bg-white/20 cursor-pointer' key={competition.id}>
                                    {/* Cover picture */}
                                    {}
                                    <div className='h-[200px] mb-2 hidden'>
                                        <img src="https://cdn.pixabay.com/collection/thumbnail/2025/06/05/island-2722471_1280.jpg" className='rounded-md size-full object-cover' alt="" />
                                    </div>

                                    <h3 className='text-lg font-semibold mb-2'>{competition.name}</h3>
                                    <p className='text-sm text-gray-300'>{competition.description}</p>
                                    <div>
                                        <button className='absolute top-6 right-6 bg-white/10 px-3 text-sm py-1 rounded-full hover:bg-white/20 flex gap-2 items-center'><BsStars /> {(status).toLowerCase()}</button>
                                    </div>
                                    <div>
                                        {competition.status === 'REGISTRATION_OPEN' ? 
                                        <p className='text-blue-500 flex items-center gap-1 mt-3'>Join now</p>
                                        : 
                                        <Link to={`/platform/competition/${competition.id}`} className='text-blue-500 flex items-center gap-1 mt-3'>
                                            Read more <ArrowRight size={15} />
                                        </Link> 
                                        }
                                    </div>
                                </div>
                            )}
                            )}
                    </div>
                    <div className='mt-20'>
                        <div className='flex justify-between mb-5'>
                            <h2 className='text-xl'>Other Competitions</h2>
                            <div className='flex items-center bg-white/10s  px-2 gap-3 border-b '>
                                <input type="text" placeholder='Search by keyword...' className='px-3 py-1 text-sm rounded-md outline-none text-white placeholder-gray-400 transition-all' />
                                <RiSearch2Line />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {/* Course Card */}
                            {competitions.map((competition) => {
                                if(competition.status == "DRAFT") return
                                const status = (competition.status == "REGISTRATION_OPEN") ? "OPEN" : competition.status;
                                return (
                                <div className='bg-white/10 p-4 relative rounded-lg hover:bg-white/20 cursor-pointer' key={competition.id}>
                                    {/* Cover picture */}
                                    {}
                                    <div className='h-[200px] mb-2 hidden'>
                                        <img src="https://cdn.pixabay.com/collection/thumbnail/2025/06/05/island-2722471_1280.jpg" className='rounded-md size-full object-cover' alt="" />
                                    </div>

                                    <h3 className='text-lg font-semibold mb-2'>{competition.name}</h3>
                                    <p className='text-sm text-gray-300'>{competition.description}</p>
                                    <div>
                                        <button className='absolute top-6 right-6 bg-white/10 px-3 text-sm py-1 rounded-full hover:bg-white/20 flex gap-2 items-center'><BsStars /> {(status).toLowerCase()}</button>
                                    </div>
                                    <div>
                                        {competition.status === 'REGISTRATION_OPEN' ? 
                                        <p className='text-blue-500 flex items-center gap-1 mt-3'>Join now</p>
                                        : 
                                        <Link to={`/platform/competition/${competition.id}`} className='text-blue-500 flex items-center gap-1 mt-3'>
                                            Read more <ArrowRight size={15} />
                                        </Link> 
                                        }
                                    </div>
                                </div>
                            )}
                            )}

                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default CompetitionPage