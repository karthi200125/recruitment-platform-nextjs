"use client";

import { useMemo, useState } from "react";
import DOMPurify from "dompurify";

import UserAboutMeSkeleton from "@/Skeletons/UserAboutMeSkeleton";
import Skills from "./Skills";
import { ProfileUser } from "@/types/userProfile";

interface Company {
    companyAbout?: string | null;
}

interface AboutMeProps {
    profileUser?: ProfileUser | null;
    isLoading?: boolean;
    isOrg?: boolean;
    company?: Company | null;
}

const AboutMe = ({
    profileUser,
    isLoading = false,
    company,
    isOrg = false,
}: AboutMeProps) => {
    const [isExpanded, setIsExpanded] = useState(false);


    const sanitizedUserAbout = useMemo(() => {
        if (!profileUser?.userAbout) return "";

        let value = profileUser.userAbout;

        if (typeof value !== "string") {
            try {
                value = JSON.stringify(value);
            } catch {
                return "";
            }
        }

        return DOMPurify.sanitize(value);
    }, [profileUser?.userAbout]);


    if (isLoading) {
        return (
            <section className="w-full min-h-[100px] rounded-[20px] border overflow-hidden p-5">
                <h3 className="font-bold mb-5">
                    {isOrg ? "About Company" : "About Me"}
                </h3>
                <UserAboutMeSkeleton />
            </section>
        );
    }

    return (
        <section className="w-full min-h-[100px] rounded-[20px] border overflow-hidden p-5">
            <h3 className="font-bold mb-5">
                {isOrg ? "About Company" : "About Me"}
            </h3>

            {isOrg ? (
                <p className="text-sm text-[var(--lighttext)] leading-relaxed">
                    {company?.companyAbout || "No company description provided."}
                </p>
            ) : (
                <>
                    {/* ABOUT TEXT */}
                    <div className="relative">
                        <div
                            className={`
                prose max-w-none text-xs md:text-sm
                transition-all duration-300 overflow-hidden
                ${isExpanded ? "max-h-full" : "line-clamp-3"}
              `}
                            dangerouslySetInnerHTML={{
                                __html:
                                    sanitizedUserAbout ||
                                    "<p>No bio provided yet.</p>",
                            }}
                        />

                        {/* SHOW MORE / LESS */}
                        {sanitizedUserAbout && (
                            <button
                                type="button"
                                onClick={() =>
                                    setIsExpanded((prev) => !prev)
                                }
                                className="
                  mt-3 text-blue-600 text-xs font-semibold
                  hover:underline focus:outline-none
                  flex justify-end w-full
                "
                            >
                                {isExpanded ? "Show Less" : "Show More"}
                            </button>
                        )}
                    </div>

                    {/* SKILLS */}
                    <Skills profileUser={profileUser} />
                </>
            )}
        </section>
    );
};

export default AboutMe;