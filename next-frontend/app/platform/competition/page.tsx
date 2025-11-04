import React from 'react'
import { BsStars } from 'react-icons/bs'
import { RiSearch2Line } from 'react-icons/ri'

function page() {
    return (
        <div>
            <h1 className='text-2xl mt-5 sm:text-3xl text-center sm:text-left'>Hey 👋 <br /> Its time to grow even stronger?</h1>

            <div>
                {/* Recent courses section */}
                <section className='mx-0! w-full!'>
                    <h2 className='text-xl mb-4 mt-10'>Recent Courses</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                        {/* Course Card */}
                        <div className='bg-white/10 p-4 relative rounded-lg hover:bg-white/20 cursor-pointer'>
                            <div className='h-1 w-full bg-slate-500/5 absolute bottom-0 left-0'>
                                <div className='h-1 w-[50%] bg-blue-500 group-hover/card1:w-[30%]'></div>
                            </div>
                            <h3 className='text-lg font-semibold mb-2'>Introduction to Cybersecurity</h3>
                            <p className='text-sm text-gray-300'>Learn the basics of cybersecurity and how to protect yourself online.</p>
                        </div>
                        <div className='bg-white/10 p-4 relative rounded-lg hover:bg-white/20 cursor-pointer'>
                            <div className='h-1 w-full bg-slate-500/5 absolute bottom-0 left-0'>
                                <div className='h-1 w-[10%] bg-blue-500 group-hover/card1:w-[30%]'></div>
                            </div>
                            <h3 className='text-lg font-semibold mb-2'>Introduction to Cybersecurity</h3>
                            <p className='text-sm text-gray-300'>Learn the basics of cybersecurity and how to protect yourself online.</p>
                        </div>
                        <div className='bg-white/10 p-4 relative rounded-lg hover:bg-white/20 cursor-pointer'>
                            <div className='h-1 w-full bg-slate-500/5 absolute bottom-0 left-0'>
                                <div className='h-1 w-[90%] bg-blue-500 group-hover/card1:w-[30%]'></div>
                            </div>
                            <h3 className='text-lg font-semibold mb-2'>Introduction to Cybersecurity</h3>
                            <p className='text-sm text-gray-300'>Learn the basics of cybersecurity and how to protect yourself online.</p>
                        </div>
                    </div>
                    <div className='mt-20'>
                        <div className='flex justify-between mb-5'>
                            <h2 className='text-xl'>Other Courses</h2>
                            <div className='flex items-center bg-white/10s  px-2 gap-3 border-b '>
                                <input type="text" placeholder='Search by keyword...' className='px-3 py-1 text-sm rounded-md outline-none text-white placeholder-gray-400 transition-all'/>
                                <RiSearch2Line />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                            {/* Course Card */}
                            <div className='bg-white/10 p-4 relative rounded-lg hover:bg-white/20 cursor-pointer'>
                                {/* Cover picture */}
                                <div className='h-[200px] mb-2'>
                                    <img src="https://cdn.pixabay.com/collection/thumbnail/2025/06/05/island-2722471_1280.jpg" className='rounded-md size-full object-cover' alt="" />
                                </div>

                                <h3 className='text-lg font-semibold mb-2'>Introduction to Cybersecurity</h3>
                                <p className='text-sm text-gray-300'>Learn the basics of cybersecurity and how to protect yourself online.</p>
                                <div>
                                    <button className='absolute top-6 right-6 bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20 flex gap-2 items-center'><BsStars /> Beginner</button>
                                </div>
                                <div>
                                    <button className='bg-blue-500 p-2 mt-2 w-full rounded-md flex items-center justify-center gap-2 hover:bg-blue-600 text-white font-medium'>
                                         Enroll</button>
                                </div>
                            </div>
                            <div className='bg-white/10 p-4 relative rounded-lg hover:bg-white/20 cursor-pointer'>
                                {/* Cover picture */}
                                <div className='h-[200px] mb-2'>
                                    <img src="https://cdn.pixabay.com/photo/2019/03/03/14/38/hacker-4031973_1280.jpg" className='rounded-md size-full object-cover' alt="" />
                                </div>

                                <h3 className='text-lg font-semibold mb-2'>Introduction to Ethick Hacking</h3>
                                <p className='text-sm text-gray-300'>Learn the basics of cybersecurity and how to protect yourself online.</p>
                                <div>
                                    <button className='absolute top-6 right-6 bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20 flex gap-2 items-center'><BsStars /> Advanced</button>
                                </div>
                                <div>
                                    <button className='bg-blue-500 p-2 mt-2 w-full rounded-md flex items-center justify-center gap-2 hover:bg-blue-600 text-white font-medium'>
                                         Enroll</button>
                                </div>
                            </div>
                            <div className='bg-white/10 p-4 relative rounded-lg hover:bg-white/20 cursor-pointer'>
                                {/* Cover picture */}
                                <div className='h-[200px] mb-2'>
                                    <img src="https://cdn.pixabay.com/photo/2015/09/09/20/17/work-933061_1280.jpg" className='rounded-md size-full object-cover' alt="" />
                                </div>

                                <h3 className='text-lg font-semibold mb-2'>Introduction to Cybersecurity</h3>
                                <p className='text-sm text-gray-300'>Learn the basics of cybersecurity and how to protect yourself online.</p>
                                <div>
                                    <button className='absolute top-6 right-6 bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20 flex gap-2 items-center'><BsStars /> Beginner</button>
                                </div>
                                <div>
                                    <button className='bg-blue-500 p-2 mt-2 w-full rounded-md flex items-center justify-center gap-2 hover:bg-blue-600 text-white font-medium'>
                                         Enroll</button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default page