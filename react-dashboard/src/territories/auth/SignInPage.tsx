import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function SignInPage() {
  return (
    <div className='mx-auto w-fit'>
      <SignIn />
    </div>
  )
}

export default SignInPage