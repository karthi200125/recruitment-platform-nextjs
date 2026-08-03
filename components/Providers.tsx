'use client'

import Store from '@/store/Store';
import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

interface ProvidersProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, 
            gcTime: 1000 * 60 * 10, 
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