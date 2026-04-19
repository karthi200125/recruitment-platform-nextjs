'use client'


import SubscriptionCard from "@/components/SubscriptionCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePathname } from "next/navigation";


const Success = () => {
    const user = useCurrentUser()    
    const pathname = usePathname()    

    return (
        <div className="w-fullpy-5 flexcenter mt-5 md:mt-10">
            <SubscriptionCard />
        </div>
    )
}

export default Success