"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
    useEffect,
    useMemo,
    useRef,
} from "react";

import { updateProfileViews } from "@/actions/user/update-profile-views";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import AboutMe from "../AboutMe";
import Education from "../Educations";
import Experiences from "../Experiences";
import MoreProfiles from "../MoreProfiles";
import Projects from "../project/Projects";
import UserInfo from "../UserInfo";
import CompanySlides from "../CompanySlides/CompanySlides";

import {
    ProfileUser,
    isCandidateRecruiterProfile,
    isOrganizationProfile,
} from "@/types/userProfile";

interface UserProfileClientProps {
    initialProfile: ProfileUser;
}

const UserProfileClient = ({
    initialProfile,
}: UserProfileClientProps) => {
    const {
        user: loggedInUser,
    } = useCurrentUser();

    const params = useParams();

    const rawUserId = params?.userId;

    const userId = useMemo(() => {
        if (typeof rawUserId !== "string") {
            return null;
        }

        if (!/^\d+$/.test(rawUserId)) {
            return null;
        }

        return Number(rawUserId);
    }, [rawUserId]);

    const hasTrackedView = useRef(false);

    const {
        data: profileData,
        isPending,
    } = useQuery<ProfileUser>({
        queryKey: [
            "getUserProfile",
            userId,
        ],

        queryFn: async () =>
            initialProfile,

        initialData: initialProfile,

        staleTime: 1000 * 60 * 5,

        refetchOnMount: false,

        refetchOnWindowFocus: false,
    });
    
    useEffect(() => {
        if (
            !loggedInUser?.id ||
            userId === null
        ) {
            return;
        }
        
        if (
            loggedInUser.id === userId
        ) {
            return;
        }
    
        if (hasTrackedView.current) {
            return;
        }

        hasTrackedView.current = true;

        updateProfileViews(
            loggedInUser.id,
            userId
        ).catch((error) => {
            console.error(
                "[UserProfile] Failed to update profile views:",
                error
            );
        });
    }, [
        loggedInUser?.id,
        userId,
    ]);
    
    if (userId === null) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm text-slate-500">
                    Invalid profile ID.
                </p>
            </div>
        );
    }
    
    if (!profileData) {
        return null;
    }

    const isOrganization =
        isOrganizationProfile(
            profileData
        );

    const isCandidateRecruiter =
        isCandidateRecruiterProfile(
            profileData
        );

    const company =
        profileData.company ?? null;

    return (
        <main className="flex min-h-screen w-full flex-col gap-5 py-6 md:flex-row">
            {/* Main column */}
            <div className="w-full space-y-5 md:w-[70%]">
                <UserInfo
                    profileUser={profileData}
                    isLoading={isPending}
                    company={company}
                    isOrg={isOrganization}
                />

                <AboutMe
                    profileUser={profileData}
                    isLoading={isPending}
                    company={company}
                    isOrg={isOrganization}
                />

                {/* Candidate / Recruiter */}
                {isCandidateRecruiter && (
                    <>
                        <Education
                            educations={
                                profileData.educations
                            }
                            profileUserId={
                                profileData.id
                            }
                            isLoading={isPending}
                        />

                        <Projects
                            projects={
                                profileData.projects
                            }
                            profileUserId={
                                profileData.id
                            }
                            isLoading={isPending}
                        />

                        <Experiences
                            experiences={
                                profileData.experiences
                            }
                            profileUserId={
                                profileData.id
                            }
                            isLoading={isPending}
                        />
                    </>
                )}

                {/* Organization */}
                {isOrganization && (
                    <CompanySlides
                        company={
                            profileData.company
                        }
                        profileUser={
                            profileData
                        }
                    />
                )}
            </div>

            {/* Sidebar */}
            <aside className="sticky top-10 hidden max-h-max w-[30%] self-start space-y-5 overflow-y-auto md:block">
                <MoreProfiles
                    profileUser={
                        profileData
                    }
                />
            </aside>
        </main>
    );
};

export default UserProfileClient;