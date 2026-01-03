import type { Challenge } from '@/types'
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  } from "@/components/ui/accordion"

import { AiFillRightSquare } from 'react-icons/ai'
import { FaLock } from 'react-icons/fa'
import { MdSimCardDownload } from 'react-icons/md'
import { RiLinksLine } from "react-icons/ri";
import { Link } from 'react-router-dom'
import { formatTimeAgoOrRemaining } from '@/lib/utils'
import { AiFillExperiment } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { useState } from 'react'
import getApiClient from '@/lib/api-client'
import { API_ENDPOINTS } from '@/config/api.config'
import { toast } from 'sonner'

interface ChallangeItemProps {
    challenges: Challenge[]
}

interface SubmissionType {
    challengeId: string,
    flag: string | undefined,
}

interface Flag {
    challengeId: string,
    flag: string | undefined
}

function ChallangeItem({
    challenges
}: ChallangeItemProps) {

    const [selected, setSelected] = useState<SubmissionType>({challengeId: '0', flag: ''});
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [flag, setFlag] = useState<string>('')
    
    const apiClient = getApiClient();

    const submitFlag = async (data: Flag) => {
        setIsSubmitting(true);
        apiClient.post(API_ENDPOINTS.SUBMISSIONS.CREATE_PUBLIC, data)
        .then((res)=> {
            if(res.data.isCorrect){
                toast.success('Sucessfully submited!');
            } else {
                toast.success(res.data.message);
            }
            setIsSubmitting(false)
        })
        .catch((err) => {
            toast.error('Your flag might be incorect!');
            setIsSubmitting(false)
        })
    }

    const DifficultyColor: Record<string, string> = {
        BEGINNER: 'from-green-400 to-green-700',
        EASY: 'from-blue-400 to-blue-700',
        MEDIUM: 'from-orange-400 to-orange-700',
        HARD: 'from-red-400 to-red-700',
        EXPERT: 'from-purple-400 to-purple-700',
    }

    return (
        <Accordion type="single" collapsible>
            {challenges.map((challenge, i) =>
                <AccordionItem value={'item-'+i}>
                    <AccordionTrigger className="hover:no-underline" onClick={() => {
                        setSelected({
                        challengeId: challenge.id,
                        flag: flag
                    })
                }
                }>
                        <div className='bg-slate-800 w-full rounded-md flex items-center overflow-hidden'>
                            <div className={`bg-radial ${DifficultyColor[challenge.difficulty]} size-[50px] flex justify-center items-center`}>
                                <AiFillRightSquare size={23} className='m-auto' />
                            </div>
                            <div className='flex justify-between w-full items-center'>
                                <h1 className='ml-3'>{challenge.title}</h1>
                                <div className='flex justify-between p-2'>
                                    <button className='bg-green-600 p-1 px-3 rounded-sm '>Solve</button>
                                </div>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className='p-5 bg-slate-800 w-full min-h-[200px] rounded-md relative'>
                            <Link to={`${challenge.url}`} target='_blank' className='absolute top-0 right-0 p-1 px-3 gap-2 bg-slate-700 flex items-center justify-center rounded-2xl m-3'><RiLinksLine /> Open link</Link>
                            <h1>{challenge.title}</h1>
                            <p className='text-zinc-400'>{challenge.description}</p>
                            <div className='mt-2 gap-2 flex-wrap hidden'>
                                <button className='bg-slate-700 p-1 text-sm rounded-sm px-2 flex items-center gap-1'>
                                    <MdSimCardDownload />
                                    PDF file
                                </button>
                                <button className='bg-slate-700 p-1 text-sm rounded-sm px-2 flex items-center gap-1'>
                                    <MdSimCardDownload />
                                    information.txt
                                </button>
                            </div>
                            <hr className='my-3 border-dashed' />
                            <div className='text-sm flex gap-2 text-gray-300'>
                                <p>By {challenge.metadata?.author || 'InfoSecGiants'}</p>
                                <span className='text-slate-600'>•</span>
                                <p>{formatTimeAgoOrRemaining(challenge.updatedAt)}</p>
                                <span className='text-slate-600'>•</span>
                                <p>{challenge.category}</p>
                            </div>
                            <hr className='my-3 border-dashed' />
                            <div>
                                <h1>Hints</h1>
                                <div className='flex gap-2 mt-2'>
                                    {challenge.hints?.map((hint, i)=>
                                        <button className='bg-green-500/5 p-1 text-sm rounded-sm px-3 flex items-center gap-1'>
                                            <AiFillExperiment className='text-green-500' />
                                            {hint.content}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className='mt-4'>
                                <div className='mt-2 bg-slate-900 p-2 rounded-sm flex justify-between'>
                                    <input type="text" placeholder='Oprix-[th3Fl0g3]' className='outline-none w-full' 
                                       onChange={(e) => {
                                        const value = e.target.value
                                        setFlag(value)
                                        setSelected(prev => ({
                                          ...prev,
                                          flag: value,
                                        }))
                                      }}
                                      
                                    />
                                    <button onClick={()=> submitFlag(selected)} className='bg-blue-500 p-1 text-sm rounded-sm px-3 flex items-center gap-1'>
                                        <div>
                                         {isSubmitting && <CgSpinner className='animate-spin' />}
                                        </div>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            )}
        </Accordion>
    )
}

export default ChallangeItem