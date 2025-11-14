import React from 'react'

function CompetionsPageSkeleton() {
  return (
    <div className='space-y-4'>
        <div className='skeleton rounded-xl w-full h-[300px]!'></div>
        <div className='flex gap-3'>
            <div className='skeleton rounded-xl w-20! h-[30px]!'></div>
            <div className='skeleton rounded-xl w-20! h-[30px]!'></div>
            <div className='skeleton rounded-xl w-20! h-[30px]!'></div>
            <div className='skeleton rounded-xl w-20! h-[30px]!'></div>
        </div>
        <div className='skeleton rounded-xl w-full h-[200px]!'></div>
    </div>
  )
}

export default CompetionsPageSkeleton