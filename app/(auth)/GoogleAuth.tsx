"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import google from "@/public/google.webp";
import Loader from "@/components/loader/CustomLoader";

const GoogleAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);

        await signIn("google", {
            callbackUrl:
                pathname === "/signin"
                    ? "/dashboard"
                    : "/",
        });

        setIsLoading(false);
    };

    return (
        <div className="w-full">
            <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-4 rounded-full border border-white/10 bg-white/[0.02] py-2 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? (
                    <Loader />
                ) : (
                    <Image
                        src={google}
                        alt="Google"
                        width={20}
                        height={20}
                        className="object-contain"
                    />
                )}

                <span className="text-[15px] text-white/30">
                    {isLoading
                        ? "Signing in..."
                        : pathname === "/signin"
                            ? "Sign In with Google"
                            : "Sign Up with Google"}
                </span>
            </button>
        </div>
    );
};

export default GoogleAuth;