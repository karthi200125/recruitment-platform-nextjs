'use client'

import React from 'react'
import { LpNavLinks } from './LpNavLinks'
import Button from '../Button'
import { useRouter } from 'next/navigation'
import Logo from '../Logo'

const LpNavbar = () => {

    const router = useRouter()

    return (
        <div className='sticky top-0 bg-black left-0  w-full text-white h-[60px] flex flex-row items-center justify-between z-20'>

            <LpNavLinks />

            <div className='absolute left-0 top-0 w-full h-full flex items-center justify-start lg:justify-center'>
                <Logo />
            </div>

            <div className='flex flex-row items-center gap-2 bg-white/10 rounded-full p-1 z-10'>
                <Button onClick={() => router.push('/signin')} className='bg-black'>Sign In</Button>
                <Button onClick={() => router.push('/signup')} className='bg-white !text-black'>Sign Up</Button>
            </div>

        </div>
    )
}

export default LpNavbar