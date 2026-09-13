import Image from "next/image";
import Link from "next/link";

interface GoogleAuthProps {
    isSignIn?: boolean;
}

const GoogleAuth = ({ isSignIn = true }: GoogleAuthProps) => {
    const callbackUrl = isSignIn ? "/dashboard" : "/signin";

    return (
        <div className="w-full">
            <Link
                href={`/api/auth/signin/google?callbackUrl=${encodeURIComponent(
                    callbackUrl
                )}`}
                className="flex w-full items-center justify-center gap-4 rounded-full border border-white/10 bg-white/[0.02] py-2 transition hover:opacity-80"
            >
                <Image
                    src="/google.webp"
                    alt="Google"
                    width={20}
                    height={20}
                    className="object-contain"
                />

                <span className="text-[15px] text-white/30">
                    {isSignIn
                        ? "Sign In with Google"
                        : "Sign Up with Google"}
                </span>
            </Link>
        </div>
    );
};

export default GoogleAuth;