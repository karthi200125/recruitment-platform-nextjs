'use client'

import GoogleAuth from '@/app/(auth)/GoogleAuth';
import RegisterForm from '@/app/Forms/RegisterForm';
import Link from 'next/link';

export default function SignUpRightSide() {
    return (
        <div className="flex flex-col justify-center w-full max-w-sm mx-auto px-2 py-12">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white tracking-tight mb-1.5">Welcome</h1>
                <p className="text-sm text-zinc-500">Sign up to create to your account</p>
            </div>

            {/* Google auth */}
            <GoogleAuth />

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-xs text-zinc-600 font-medium">or continue with email</span>
                <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {/* Login form */}
            <RegisterForm />

            {/* Sign up link */}
            <p className="mt-8 text-center text-sm text-zinc-600">
                Already Have an Account?{" "}
                <Link href="/signin" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors duration-200">
                    Signin
                </Link>
            </p>

        </div>
    );
}
