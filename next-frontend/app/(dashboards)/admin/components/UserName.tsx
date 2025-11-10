import React from 'react'
import { currentUser } from '@clerk/nextjs/server'

async function UserName() {
  const user = await currentUser()
  return (
    <span>
        {user?.firstName}
    </span>
  )
}

export default UserName