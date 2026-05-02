"use client";

import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { FileText, ChevronDown, ChevronUp, Building2 } from "lucide-react";

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

const AboutMe = ({ profileUser, isLoading = false, company, isOrg = false }: AboutMeProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const sanitizedUserAbout = useMemo(() => {
        if (!profileUser?.userAbout) return "";
        let value = profileUser.userAbout;
        if (typeof value !== "string") {
            try { value = JSON.stringify(value); } catch { return ""; }
        }
        return DOMPurify.sanitize(value);
    }, [profileUser?.userAbout]);

    const SectionIcon = isOrg ? Building2 : FileText;
    const sectionTitle = isOrg ? "About the Company" : "About Me";

    return (
        <section className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                <SectionIcon className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                <h3 className="text-sm font-bold text-slate-800">{sectionTitle}</h3>
            </div>

            <div className="p-5 space-y-4">
                {isLoading ? (
                    <UserAboutMeSkeleton />
                ) : isOrg ? (
                    /* Company about */
                    <p className="text-sm text-slate-500 leading-relaxed">
                        {company?.companyAbout || (
                            <span className="italic text-slate-400">No company description provided yet.</span>
                        )}
                    </p>
                ) : (
                    /* User about */
                    <>
                        <div>
                            <div
                                className={`
                                    prose prose-sm max-w-none
                                    prose-p:text-slate-600 prose-p:leading-relaxed
                                    prose-headings:text-slate-800 prose-headings:font-semibold
                                    prose-li:text-slate-600 prose-strong:text-slate-800
                                    prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                                    text-sm text-slate-600 leading-relaxed
                                    transition-all duration-300 overflow-hidden
                                    ${!isExpanded ? "line-clamp-4" : ""}
                                `}
                                dangerouslySetInnerHTML={{
                                    __html: sanitizedUserAbout || "<p class='text-slate-400 italic'>No bio provided yet.</p>",
                                }}
                            />

                            {sanitizedUserAbout && (
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded((p) => !p)}
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                                >
                                    {isExpanded ? (
                                        <><ChevronUp className="w-3.5 h-3.5" strokeWidth={2.5} />Show less</>
                                    ) : (
                                        <><ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />Show more</>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Skills section */}
                        <div className="h-px bg-slate-100" />
                        <Skills profileUser={profileUser} />
                    </>
                )}
            </div>
        </section>
    );
};

export default AboutMe;