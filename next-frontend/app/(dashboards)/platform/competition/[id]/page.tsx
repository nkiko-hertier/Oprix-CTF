"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { BsStars } from 'react-icons/bs';
import MainTab from '@/app/components/Tab';
import CompetitonsPages from '@/app/components/CompetitonsPages';

function page() {
    const params = useParams();
    return (
        <div>
            <div className='h-[300px] relative mb-2'>
                <button className='absolute top-6 right-6 bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20 flex gap-2 items-center'><BsStars /> Beginner</button>
                <div className='bg-linear-to-t from-black rounded-md absolute size-full p-4 flex flex-col justify-end'>
                    <h1 className='text-2xl'>Oprix CTF 2025</h1>
                    <p className='text-zinc-500'>
                        Hosted by Oprix Security | Starts on 25th Dec 2024
                    </p>
                </div>
                <img src="https://cdn.pixabay.com/collection/thumbnail/2025/06/05/island-2722471_1280.jpg" className='rounded-md size-full object-cover' alt="" />
            </div>
            <CompetitonsPages id={params.id} />
        </div>
    )
}

export default page