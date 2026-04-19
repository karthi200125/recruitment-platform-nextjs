'use client'

import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
    const { data } = useSession();

    return data?.user?.role;
};