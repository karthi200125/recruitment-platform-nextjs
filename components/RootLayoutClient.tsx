'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import LpNavbar from "@/components/Navbar/LandingPageNavbar";
import { SessionUser } from "@/types";

interface RootLayoutClientProps {
  children: React.ReactNode;
  user: SessionUser | null;
}

const HIDDEN_NAV_PATHS = ["/signin", "/signup", "/select-role"];

const LP_NAV_PATHS = ["/"];

export default function RootLayoutClient({ children, user }: RootLayoutClientProps) {
  const pathname = usePathname();

  const isHiddenNav = HIDDEN_NAV_PATHS.includes(pathname);
  const isLpNav = LP_NAV_PATHS.includes(pathname);
  const isDarkBg = isHiddenNav || isLpNav;

  return (
    <div className={`w-full min-h-screen ${isDarkBg ? "bg-black" : "bg-white"}`}>
      <div
        className={`
                    max-w-[1440px] min-h-screen mx-auto
                    px-2 sm:px-6 md:px-8 lg:px-4
                    ${isDarkBg ? "bg-black" : "bg-white"}
                `}
      >
        {/* Navbar selection */}
        {!isHiddenNav && (
          isLpNav
            ? <LpNavbar />
            : <Navbar user={user} />
        )}

        {children}
      </div>
    </div>
  );
}