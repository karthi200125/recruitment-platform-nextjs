'use client';

import {  useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Loader from '@/components/loader/Loader';

const GoogleAuth = () => {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = useCallback(async () => {        
        setIsLoading(true);

        try {
            await signIn('google', {
                callbackUrl: pathname === '/signin' ? '/dashboard' : '/welcome',
            });            
            setIsLoading(false);
        } catch (error) {
            console.error('Google sign-in failed:', error);
            setIsLoading(false);
        }
    }, [pathname]);

    const isSignIn = pathname === '/signin';

    return (
        <div className="w-full">
            <button
                type="button"
                onClick={onClick}
                disabled={isLoading}
                className={`w-full rounded-full flex items-center gap-4 justify-center py-2 border border-white/10 transition hover:opacity-80 ${isLoading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
            >
                {isLoading ? (
                    <Loader />
                ) : (
                    <Image src='/google.webp' alt="Google logo" width={20} height={20} className="object-contain" />
                )}
                <span className="text-white/30 text-[15px]">
                    {isLoading ? 'Please wait...' : isSignIn ? 'Sign In with Google' : 'Sign Up with Google'}
                </span>
            </button>
        </div>
    );
};

export default GoogleAuth;