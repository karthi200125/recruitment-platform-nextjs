import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Role } from "@prisma/client";
import { BadgeCheck, Crown, Medal } from "lucide-react";

interface BadgeProps {
    type?: Role | "premium";
}

const badgeConfig = {
    premium: {
        icon: <Crown className="h-5 w-5 text-amber-500" />,
        title: "Premium Member",
    },
    RECRUITER: {
        icon: <Medal className="h-5 w-5 text-emerald-500" />,
        title: "Recruiter",
    },
    CANDIDATE: {
        icon: <Medal className="h-5 w-5 text-blue-500" />,
        title: "Candidate",
    },
    ORGANIZATION: {
        icon: <BadgeCheck className="h-5 w-5 text-sky-500" />,
        title: "Verified Organization",
    },
} as const;

const Badge = ({ type }: BadgeProps) => {
    if (!type || !badgeConfig[type]) {
        return null;
    }

    const { icon, title } = badgeConfig[type];

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className="flex items-center justify-center cursor-pointer"
                        aria-label={title}
                    >
                        {icon}
                    </div>
                </TooltipTrigger>

                <TooltipContent
                    side="top"
                    className="rounded-md bg-black px-3 py-2 text-xs text-white"
                >
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Badge;