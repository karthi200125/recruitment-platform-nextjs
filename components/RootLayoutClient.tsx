'use client'

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import LpNavbar from "@/components/Navbar/LpNavbar";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const pathname = usePathname();
  const blackBg = pathname === '/' || pathname === '/signin' || pathname === '/signUp'

  return (
    <div className={`w-full min-h-screen ${blackBg ? "bg-black" : "bg-white"} `}>
      <div className={`max-w-[1440px] min-h-screen mx-auto px-2 sm:px-6 md:px-8 lg:px-4 ${blackBg ? "bg-black" : "bg-white"}`}>
        {(pathname !== '/signin' && pathname !== '/signUp') &&
          (pathname === '/' ? <LpNavbar /> : <Navbar />)
        }
        {children}
      </div>
    </div>
  );
}
