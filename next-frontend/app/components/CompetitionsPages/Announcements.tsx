import React from 'react'
import { GradientCard } from '../HomeCards'
import { Skeleton } from '@/components/ui/skeleton'

function Announcements({id}: {id: any}) {
  return (
    <div>
      Announcements
      <div className='mt-5 space-y-2'>
        <GradientCard className='min-h-fit! p-4'>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis maiores quibusdam ut quo vitae consectetur, vel impedit nisi pariatur et saepe sunt eligendi! Fugit ullam unde consequuntur reprehenderit obcaecati harum.</p>
          <div className='border-b my-2 mt-4 border-dashed'></div>
          <p className='text-slate-300'>2 days ago</p>
        </GradientCard>
        <GradientCard className='min-h-fit! p-4'>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis maiores quibusdam ut quo vitae consectetur, vel impedit nisi pariatur et saepe sunt eligendi! Fugit ullam unde consequuntur reprehenderit obcaecati harum.</p>
          <div className='border-b my-2 mt-4 border-dashed'></div>
          <p className='text-slate-300'>2 days ago</p>
        </GradientCard>
        <GradientCard className='min-h-fit! p-4'>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis maiores quibusdam ut quo vitae consectetur, vel impedit nisi pariatur et saepe sunt eligendi! Fugit ullam unde consequuntur reprehenderit obcaecati harum.</p>
          <div className='border-b my-2 mt-4 border-dashed'></div>
          <p className='text-slate-300'>2 days ago</p>
        </GradientCard>
        <GradientCard className='min-h-fit! p-4'>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis maiores quibusdam ut quo vitae consectetur, vel impedit nisi pariatur et saepe sunt eligendi! Fugit ullam unde consequuntur reprehenderit obcaecati harum.</p>
          <div className='border-b my-2 mt-4 border-dashed'></div>
          <p className='text-slate-300'>2 days ago</p>
        </GradientCard>
        
      </div>
    </div>
  )
}

export default Announcements