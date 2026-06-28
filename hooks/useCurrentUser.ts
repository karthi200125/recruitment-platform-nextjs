import { useSession } from "next-auth/react";

import { SessionUser } from "@/types";

interface UseCurrentUserReturn {
    user: SessionUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const useCurrentUser = (): UseCurrentUserReturn => {
    const { data: session, status } = useSession();

    return {
        user: session?.user
            ? (session.user as any)
            : null,
        isAuthenticated: !!session?.user,
        isLoading: status === "loading",
    };
};