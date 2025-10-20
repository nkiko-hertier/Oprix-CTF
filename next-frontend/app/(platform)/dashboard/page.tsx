"use client"
import { useAuth, UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
export default function page() {
    const [token, setToken] = useState("")
    const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth()

    
    useEffect(()=>{
        const LoadData = async () => {
            const UserToken: string | null = await getToken();
            setToken(UserToken);
        }
        LoadData();
    },[])

    if(!isLoaded) return <h1>Loading...</h1>
    return(
        <>
            <UserButton />
            <h1 className='p-2 w-screen'>Token: {token}</h1>
        </>
    )
}