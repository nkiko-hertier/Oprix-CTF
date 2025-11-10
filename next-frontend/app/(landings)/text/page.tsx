import React from 'react'
import UserName from './components/UserName'
import { GradientCard } from '@/app/components/HomeCards'
import { BsStars } from 'react-icons/bs'

function page() {
    return (
        <div>
            {/* Basic analytics */}
            <div className='h-[300px] relative mb-2'>
                <div className='bg-linear-to-t from-black rounded-md absolute size-full p-4S flex flex-col justify-end'> 
                    <GradientCard className='bg-linear-to-t from-black rounded-md absolute size-full p-4 flex flex-col justify-end'>
                    <button className='absolute top-6 right-6 bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20 flex gap-2 items-center'><BsStars /> Beginner</button>
                    <div>
                        <h1 className='text-2xl'>Hi 👋 <UserName />,<br /></h1>
                        <p className='text-zinc-500'>Welcome to Oprix CTF</p>
                    </div>
                    </GradientCard>
                </div>
                <img src="https://cdn.pixabay.com/collection/thumbnail/2025/06/05/island-2722471_1280.jpg" className='rounded-md size-full object-cover' alt="" />
            </div>
            <div className='grid grid-cols-4 gap-4 mt-5'>
                {[1012, 33, 3, 5].map((item, index) => (
                    <GradientCard key={index} className='p-3 min-h-[150px]! flex relative'>
                        <div className='absolute top-2 right-5 text-5xl blur-md'>📅</div>
                        <div className='absolute top-2 right-5 text-3xl'>📅</div>
                        <div className='mt-auto'>
                            <p>Total Copetitions</p>
                            <p className='text-2xl font-bold'>{item}</p>
                            <p className='text-sm text-gray-500'>3 days ago</p>
                        </div>
                    </GradientCard>
                ))}
            </div>
        </div>
    )
}

export default page