"use client";

import { useEffect, useRef } from "react";

import { updateProfileViews } from "@/actions/user/update-profile-views";

import UserInfo from "../UserInfo";
import ProfileResume from "../ProfileResume";
import AboutMe from "../AboutMe";
import Education from "../Educations";
import Projects from "../project/Projects";
import Experiences from "../Experiences";

import MoreProfilesServer from "../MoreProfilesServer";

import CompanySlidesSkeleton from "@/components/skeletons/CompanySlidesSkeleton";
import { SkeletonRow } from "@/components/skeletons/MoreProfileSkeleton";

import {
    ProfileUser,
    isCandidateRecruiterProfile,
    isOrganizationProfile,
} from "@/types/userProfile";

import { Suspense } from "react";
import CompanySlidesServer from "../CompanySlides/CompanySlides";

interface CurrentUser {
    id: number;
    isPro: boolean;
}

interface UserProfileClientProps {
    initialProfile: ProfileUser;
    currentUserId?: number;
    currentUser?: CurrentUser | null;
}

const UserProfileClient = ({
    initialProfile,
    currentUserId,
    currentUser,
}: UserProfileClientProps) => {
    const hasTrackedView = useRef(false);

    /* ---------------------------------------
       Profile view tracking

       This is the only client-side behavior
       that belongs in this boundary.
    ---------------------------------------- */

    useEffect(() => {
        if (!currentUserId) return;

        if (currentUserId === initialProfile.id) {
            return;
        }

        if (hasTrackedView.current) {
            return;
        }

        hasTrackedView.current = true;

        updateProfileViews(
            currentUserId,
            initialProfile.id
        ).catch(() => { });
    }, [currentUserId, initialProfile.id]);

    /* ---------------------------------------
       Profile type
    ---------------------------------------- */

    const isOrganization =
        isOrganizationProfile(initialProfile);

    const isCandidateRecruiter =
        isCandidateRecruiterProfile(initialProfile);

    const company = isOrganization
        ? initialProfile.company
        : null;

    return (
        <main className="flex min-h-screen w-full flex-col gap-5 py-6 md:flex-row">

            {/* ---------------------------------------
                Main profile column
            ---------------------------------------- */}

            <div className="w-full space-y-5 md:w-[70%]">

                {/* ---------------------------------------
                    CRITICAL ABOVE-FOLD CONTENT

                    Keep these immediately renderable.
                ---------------------------------------- */}

                <UserInfo
                    profileUser={initialProfile}
                    isLoading={false}
                    company={company}
                    isOrg={isOrganization}
                />

                <AboutMe
                    profileUser={initialProfile}
                    isLoading={false}
                    company={company}
                    isOrg={isOrganization}
                />

                {/* ---------------------------------------
                    Resume
                ---------------------------------------- */}

                <Suspense
                    fallback={
                        <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-100" />
                    }
                >
                    <ProfileResume
                        resume={initialProfile.resume}
                        resumePublicId={
                            initialProfile.resumePublicId
                        }
                    />
                </Suspense>

                {/* ---------------------------------------
                    Candidate / Recruiter sections
                ---------------------------------------- */}

                {isCandidateRecruiter && (
                    <>
                        <Suspense
                            fallback={
                                <div className="h-40 w-full animate-pulse rounded-2xl bg-slate-100" />
                            }
                        >
                            <Education
                                educations={
                                    initialProfile.educations
                                }
                                profileUserId={
                                    initialProfile.id
                                }
                                isLoading={false}
                            />
                        </Suspense>

                        <Suspense
                            fallback={
                                <div className="h-40 w-full animate-pulse rounded-2xl bg-slate-100" />
                            }
                        >
                            <Projects
                                projects={
                                    initialProfile.projects
                                }
                                profileUserId={
                                    initialProfile.id
                                }
                                isLoading={false}
                            />
                        </Suspense>

                        <Suspense
                            fallback={
                                <div className="h-40 w-full animate-pulse rounded-2xl bg-slate-100" />
                            }
                        >
                            <Experiences
                                experiences={
                                    initialProfile.experiences
                                }
                                profileUserId={
                                    initialProfile.id
                                }
                                isLoading={false}
                            />
                        </Suspense>
                    </>
                )}

                {/* ---------------------------------------
                    Organization sections

                    Fetch independently so company jobs
                    and employees do not block the core
                    profile query.
                ---------------------------------------- */}

                {isOrganization && (
                    <Suspense
                        fallback={
                            <CompanySlidesSkeleton />
                        }
                    >
                        <CompanySlidesServer
                            userId={initialProfile.id}
                        />
                    </Suspense>
                )}
            </div>

            {/* ---------------------------------------
                Desktop secondary sidebar

                Not part of critical profile content.
            ---------------------------------------- */}

            <aside className="hidden w-[30%] self-start md:sticky md:top-20 md:block">
                <Suspense
                    fallback={<SkeletonRow />}
                >
                    <MoreProfilesServer
                        profileUserId={
                            initialProfile.id
                        }
                        currentUser={currentUser}
                    />
                </Suspense>
            </aside>
        </main>
    );
};

export default UserProfileClient;