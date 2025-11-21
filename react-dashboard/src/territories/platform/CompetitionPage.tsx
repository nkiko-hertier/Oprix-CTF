import type { Competition, PaginatedResponse } from '@/types'
import { BsStars } from 'react-icons/bs'
import { RiSearch2Line } from 'react-icons/ri'

import { useEffect, useState } from 'react'
import getApiClient from '@/lib/api-client'
import { API_ENDPOINTS } from '@/config/api.config';
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import NoContent from '@/components/NoContent'
import { JoinCompetition } from '@/components/Models/JoinCompetition'

function CompetitionPage() {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [myCompetitions, setMyCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [Floading, setFLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('date');

    useEffect(() => {
        fetchCompetitions();
        fetchMyCompetitions();
    }, []);

    const fetchCompetitions = async () => {
        try {
            setFLoading(true);
            const params = new URLSearchParams();
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }
            
            const response = await getApiClient().get<PaginatedResponse<Competition>>(
                `${API_ENDPOINTS.COMPETITIONS.LIST}?${params.toString()}`
            );
            if (response.data.data) {
                let filtered = response.data.data;
                
                // Client-side search
                if (searchTerm) {
                    filtered = filtered.filter((comp) =>
                        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        comp.description.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
                
                // Client-side sorting
                filtered = [...filtered].sort((a, b) => {
                    if (sortBy === 'date') {
                        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
                    }
                    if (sortBy === 'name') {
                        return a.name.localeCompare(b.name);
                    }
                    if (sortBy === 'participants') {
                        return (b._count?.registrations || 0) - (a._count?.registrations || 0);
                    }
                    return 0;
                });
                
                setCompetitions(filtered);
            }
        } catch (error) {
            console.error('Failed to fetch competitions:', error);
        } finally {
            setFLoading(false);
        }
    };

    const fetchMyCompetitions = async () => {
        try {
            const response = await getApiClient().get<PaginatedResponse<Competition>>(API_ENDPOINTS.COMPETITIONS.MY);
            if (response.data.data) setMyCompetitions(response.data.data);
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch my competitions:', error);
            setLoading(false)
        }
    };

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCompetitions();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, sortBy]);

    return (
        <div>
            <h1 className='text-2xl mt-5 sm:text-3xl text-center sm:text-left'>Hey 👋 <br /> Its time to grow even stronger?</h1>

            <div>
                {/* Recent courses section */}
                <section className='mx-0! w-full!'>
                    <h2 className='text-xl mb-4 mt-10'>Continue solving</h2>

                    {(myCompetitions.length == 0 && !loading) && <NoContent title="You have not joined any competitions yet" description="Browse competitions below to find one that interests you." />}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                         {
                                (loading) && [1,2,3,4].map(() =>
                            <div className='skeleton min-h-[130px]'></div>)
                            }
                        {myCompetitions.map((competition) => {
                                if(competition.status == "DRAFT") return
                                const status = (competition.status == "REGISTRATION_OPEN") ? "OPEN" : competition.status;
                                return (
                                <div className='bg-white/10 p-4 relative rounded-lg hover:bg-white/20 cursor-pointer' key={competition.id}>
                                    {/* Cover picture */}
                                    <div className='h-[200px] mb-2 hiddens'>
                                        <img src="https://cdn.pixabay.com/collection/thumbnail/2025/06/05/island-2722471_1280.jpg" className='rounded-md size-full object-cover' alt="" />
                                    </div>

                                    <h3 className='text-lg font-semibold mb-2'>{competition.name}</h3>
                                    <p className='text-sm text-gray-300'>{competition.description}</p>
                                    <div>
                                        <button className='absolute top-6 right-6 bg-white/10 px-3 text-sm py-1 rounded-full hover:bg-white/20 flex gap-2 items-center'><BsStars /> {(status).toLowerCase()}</button>
                                    </div>
                                    <div>
                                        {competition.status === 'REGISTRATION_OPEN' ? 
                                        <p className='text-blue-500 flex items-center gap-1 mt-3'>
                                            <JoinCompetition isReged={true} competition={competition} />
                                        </p>

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
                        <div className='flex flex-col sm:flex-row justify-between gap-4 mb-5'>
                            <h2 className='text-xl'>Other Competitions</h2>
                            <div className='flex flex-col sm:flex-row gap-3'>
                                <div className='flex items-center bg-white/10 px-3 gap-2 rounded-md border border-white/20'>
                                    <RiSearch2Line className='text-gray-400' />
                                    <input 
                                        type="text" 
                                        placeholder='Search by keyword...' 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='px-2 py-2 text-sm bg-transparent outline-none text-white placeholder-gray-400 w-full' 
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className='px-3 py-2 text-sm rounded-md bg-white/10 border border-white/20 text-white outline-none'
                                >
                                    <option value="all">All Status</option>
                                    <option value="REGISTRATION_OPEN">Registration Open</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className='px-3 py-2 text-sm rounded-md bg-white/10 border border-white/20 text-white outline-none'
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="name">Sort by Name</option>
                                    <option value="participants">Sort by Participants</option>
                                </select>
                            </div>
                        </div>
                            {!Floading && competitions.length == 0 && <NoContent title="No competitions found" description="No competitions found" />}
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]'>
                            {/* Course Card */}
                            {
                                (Floading) && [1,2,3,4].map(() =>
                            <div className='skeleton min-h-[130px]'></div>)

                            }
                            {competitions.map((competition) => {
                                if(competition.status == "DRAFT") return
                                const status = (competition.status == "REGISTRATION_OPEN") ? "OPEN" : competition.status;
                                return (
                                <div hidden={Floading}  className={`bg-white/10 p-4 relative rounded-lg hover:bg-white/20 cursor-pointer`} key={competition.id}>
                                    <div className='h-[150px] mb-2 hiddens'>
                                        <img src="https://cdn.pixabay.com/collection/thumbnail/2025/06/05/island-2722471_1280.jpg" className='rounded-md size-full object-cover' alt="" />
                                    </div>

                                    <h3 className='text-lg font-semibold mb-2'>{competition.name}</h3>
                                    <p className='text-sm text-gray-300'>{competition.description}</p>
                                    <div>
                                        <button className='absolute top-6 right-6 bg-white/10 px-3 text-sm py-1 rounded-full hover:bg-white/20 flex gap-2 items-center'><BsStars /> {(status).toLowerCase()}</button>
                                    </div>
                                    <div>
                                        <p className='text-blue-500 flex items-center gap-1 mt-3'>
                                            <JoinCompetition competition={competition} />
                                        </p>
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