'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Button from '../Button'
import Logo from '../Logo'
import { LpNavLinks } from './LpNavLinks'
import CtaButton from '../ui/CtaButton'

const LpNavbar = () => {

    const router = useRouter()

    const [scrolled, setScrolled] =
        useState(false)

    useEffect(() => {

        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener(
            'scroll',
            handleScroll
        )

        return () =>
            window.removeEventListener(
                'scroll',
                handleScroll
            )

    }, [])

    return (
        <header
            className={`
                fixed inset-x-0 z-50
                transition-all duration-500
                ${scrolled
                    ? 'top-3'
                    : 'top-0'
                }
            `}
        >

            <div
                className={`
                    mx-auto flex h-[72px]
                    w-[95%] max-w-7xl
                    items-center justify-between
                    rounded-2xl px-2
                    transition-all duration-500

                    ${scrolled
                        ? `                            
                            bg-black/60
                              backdrop-blur-xl
                            supports-[backdrop-filter]:bg-black/50
                          `
                        : `
                            bg-transparent
                          `
                    }
                `}
            >

                {/* LEFT */}
                <div className='hidden md:flex items-center text-white'>
                    <LpNavLinks />
                </div>

                {/* CENTER LOGO */}
                <div className=' md:absolute md:left-1/2 md:-translate-x-1/2'>
                    <Logo />
                </div>

                {/* RIGHT */}
                <div className='flex items-center gap-2'>

                    <CtaButton
                        href="/signin"
                        variant="primary"
                        size='default'
                    >
                        Sign In
                    </CtaButton>

                    <CtaButton
                        href="/signup"
                        variant="secondary"
                    >
                        Sign Up
                    </CtaButton>

                </div>
            </div>
        </header>
    )
}

export default LpNavbar