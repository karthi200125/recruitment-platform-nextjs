'use client'

import Button from "@/components/Button"
import { useRouter } from "next/navigation"

export default function GetStartedButton() {
    const router = useRouter()
    
    return (
        <Button onClick={() => router.push('/signin')}>Get Started</Button>
    )
}
