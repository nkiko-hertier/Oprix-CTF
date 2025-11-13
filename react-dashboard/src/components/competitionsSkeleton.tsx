import React from 'react'

function CompetitionsSkeleton(
    {
        numberOfItems = 4,
    }: {
        numberOfItems?: number
    }
) {

    if (true) {
        [1, 2, 3, 4].map(() => {
            return <div className='skeleton min-h-[130px]'></div>
        })
    }
}

export default CompetitionsSkeleton