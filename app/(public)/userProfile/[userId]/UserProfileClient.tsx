"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import UserInfo from "../UserInfo";

import CompanySlidesSkeleton from "@/components/skeletons/CompanySlidesSkeleton";
import { SkeletonRow } from "@/components/skeletons/MoreProfileSkeleton";

import {
    ProfileUser,
    isCandidateRecruiterProfile,
    isOrganizationProfile,
} from "@/types/userProfile";
import CompanySlidesServer from "../CompanySlides/CompanySlides";
import MoreProfilesServer from "../MoreProfilesServer";

interface CurrentUser {
    id: number;
    isPro: boolean;
}

interface UserProfileClientProps {
    initialProfile: ProfileUser;
    currentUser?: CurrentUser | null;
}

/* ---------------------------------------
   Dynamic profile sections
---------------------------------------- */

const ProfileResume = dynamic(
    () => import("../ProfileResume")
);

const AboutMe = dynamic(
    () => import("../AboutMe")
);

const Education = dynamic(
    () => import("../Educations")
);

const Projects = dynamic(
    () => import("../project/Projects")
);

const Experiences = dynamic(
    () => import("../Experiences")
);

/* ---------------------------------------
   Main component
---------------------------------------- */

const UserProfileClient = ({
    initialProfile,
    currentUser,
}: UserProfileClientProps) => {
    const profileData = initialProfile;

    if (!profileData) {
        return null;
    }

    const isOrganization =
        isOrganizationProfile(profileData);

    const isCandidateRecruiter =
        isCandidateRecruiterProfile(profileData);

    const company = isOrganization
        ? profileData.company
        : null;

    return (
        <main className="flex min-h-screen w-full flex-col gap-5 py-6 md:flex-row">

            {/* Main column */}
            <div className="w-full space-y-5 md:w-[70%]">

                {/* Immediate */}
                <UserInfo
                    profileUser={profileData}
                    isLoading={false}
                    company={company}
                    isOrg={isOrganization}
                />

                {/* Resume */}
                <Suspense
                    fallback={
                        <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-100" />
                    }
                >
                    <ProfileResume
                        resume={profileData.resume}
                        resumePublicId={
                            profileData.resumePublicId
                        }
                    />
                </Suspense>

                {/* About */}
                <Suspense
                    fallback={
                        <div className="h-32 w-full animate-pulse rounded-2xl bg-slate-100" />
                    }
                >
                    <AboutMe
                        profileUser={profileData}
                        isLoading={false}
                        company={company}
                        isOrg={isOrganization}
                    />
                </Suspense>

                {/* Candidate / Recruiter */}
                {isCandidateRecruiter && (
                    <>
                        <Suspense
                            fallback={
                                <div className="h-40 w-full animate-pulse rounded-2xl bg-slate-100" />
                            }
                        >
                            <Education
                                educations={
                                    profileData.educations
                                }
                                profileUserId={
                                    profileData.id
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
                                    profileData.projects
                                }
                                profileUserId={
                                    profileData.id
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
                                    profileData.experiences
                                }
                                profileUserId={
                                    profileData.id
                                }
                                isLoading={false}
                            />
                        </Suspense>
                    </>
                )}

                {/* Organization only */}
                {isOrganization && (
                    <Suspense
                        fallback={<CompanySlidesSkeleton />}
                    >
                        <CompanySlidesServer
                            userId={profileData.id}
                        />
                    </Suspense>
                )}

            </div>

            {/* Desktop sidebar */}
            <aside className="hidden w-[30%] self-start md:sticky md:top-20 md:block">
                <Suspense
                    fallback={<SkeletonRow />}
                >
                    <MoreProfilesServer
                        profileUserId={profileData.id}
                        currentUser={currentUser}
                    />
                </Suspense>
            </aside>

        </main>
    );
};

export default UserProfileClient;