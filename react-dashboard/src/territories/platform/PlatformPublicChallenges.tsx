import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import getApiClient from '@/lib/api-client';
import { useEffect, useState } from 'react';
import { AiFillRightSquare } from "react-icons/ai";
import { FaLock } from 'react-icons/fa';
import { MdSimCardDownload } from 'react-icons/md';
import type { Challenge } from '@/types';
import ChallangeItem from '@/components/ChallangeItem';

function PlatformPublicChallenges() {

    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const apiClient = getApiClient()

    const DifficultyColor: Record<string, string> = {
        BEGINNER: 'from-green-400 to-green-700',
        EASY: 'from-blue-400 to-blue-700',
        MEDIUM: 'from-orange-400 to-orange-700',
        HARD: 'from-red-400 to-red-700',
        EXPERT: 'from-purple-400 to-purple-700',
    }

    const getChallenges = async () => {
        const data = await apiClient.get('/challenges/public');
        setChallenges(data.data)
    }
    useEffect(() => {
        getChallenges()
    }, [])
    return (
        <div>
            <h1 className='text-2xl mt-5 sm:text-3xl text-center sm:text-left mb-5'>Welcome here 👋 <br /> May we do some practices?</h1>
            <div className='flex justify-between'>
                <h1 className='text-sm'><span className='text-zinc-600'>Platform/</span>Public-Challenges</h1>
                <div className='flex gap-2 hidden'>
                    <Input placeholder='search by keyword' />
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>select Category</SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='grids grid-cols-3 mt-10 gap-2'>
                <div className=' col-span-2 space-y-2'>
                        <ChallangeItem  challenges={challenges} />

                </div>
                <div >
                    <div className='p-5 hidden bg-slate-800 w-full min-h-[200px] rounded-md'>
                        <h1>The scater frame rising</h1>
                        <p className='text-zinc-400'>Lorem, ipsum dolor sit amet e voluptatem culpa! Reiciendis ex a!</p>
                        <div className='mt-2 flex gap-2 flex-wrap'>
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
                        <div>
                            <h1>Hints</h1>
                            <div className='flex gap-2 mt-2'>
                                <button className='bg-white/5 p-1 text-sm rounded-sm px-3 flex items-center gap-1'>
                                    <FaLock size={11} />
                                    Hint 1
                                </button>
                                <button className='bg-white/5 p-1 text-sm rounded-sm px-3 flex items-center gap-1'>
                                    <FaLock size={11} />
                                    Hint 2
                                </button>
                            </div>
                        </div>
                        <div className='mt-4'>
                            <div className='mt-2 bg-slate-900 p-2 rounded-sm flex justify-between'>
                                <input type="text" placeholder='Oprix-[th3Fl0g3]' className='outline-none' />
                                <button className='bg-blue-500 p-1 text-sm rounded-sm px-3 flex items-center gap-1'>
                                    <FaLock />
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlatformPublicChallenges