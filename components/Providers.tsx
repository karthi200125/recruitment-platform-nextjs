'use client'

import Store from "@/app/Redux/Store";
import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

interface ProvidersProps {
    children: React.ReactNode;
}

// CRITICAL FIX: Move QueryClient to module scope to persist cache across re-renders
// Previously created new instance on every render, destroyed React Query cache
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
        },
    },
});

const Providers = ({ children }: ProvidersProps) => {
    return (
        <SessionProvider>
            <Provider store={Store}>
                <QueryClientProvider client={queryClient}>                        
                    {children}
                </QueryClientProvider>
            </Provider>
        </SessionProvider>
    )
}

export default Providers