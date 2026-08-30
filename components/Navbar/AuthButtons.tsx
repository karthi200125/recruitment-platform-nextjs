import CtaButton from "../ui/CtaButton";


const AuthButtons = () => {
    return (
        <div
            className="                
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-1
                backdrop-blur-xl
            "
        >
            <CtaButton
                href="/signin"
                variant="secondary"
                className="
                    h-10
                    rounded-xl
                    px-4
                    text-xs
                    font-semibold
                "
            >
                Sign In
            </CtaButton>

            <CtaButton
                href="/signup"
                variant="primary"
                className="
                    h-10
                    rounded-xl
                    px-4
                    text-xs
                    font-semibold
                "
            >
                Sign Up
            </CtaButton>
        </div>
    );
};

export default AuthButtons;