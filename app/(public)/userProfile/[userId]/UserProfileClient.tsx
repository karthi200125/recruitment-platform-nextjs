"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import { updateProfileViews } from "@/actions/user/update-profile-views";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import AboutMe from "../AboutMe";
import Education from "../Educations";
import Experiences from "../Experiences";
import MoreProfiles from "../MoreProfiles";
import Projects from "../project/Projects";
import UserInfo from "../UserInfo";


import { ProfileUser } from "@/types/userProfile";

interface UserProfileClientProps {
    initialProfile: ProfileUser;
}

const UserProfileClient = ({
    initialProfile,
}: UserProfileClientProps) => {
    const session = useCurrentUser();
    const loggedInUser = session?.user;

    const params = useParams();
    const rawUserId = params?.userId;

    const userId = useMemo(() => {
        if (typeof rawUserId !== "string") return null;
        if (!/^\d+$/.test(rawUserId)) return null;
        return Number(rawUserId);
    }, [rawUserId]);

    const hasTrackedView = useRef(false);

    const {
        data: profileData,
        isPending,
    } = useQuery<ProfileUser>({
        queryKey: ["getUserProfile", userId],

        queryFn: async () => initialProfile,

        initialData: initialProfile,

        staleTime: 1000 * 60 * 5,

        refetchOnMount: false,

        refetchOnWindowFocus: false,
    });

    const company = profileData?.company ?? null;
    const isOrg = profileData?.role === "ORGANIZATION";

    useEffect(() => {
        if (!loggedInUser?.id || userId === null) return;
        if (loggedInUser.id === userId) return;
        if (hasTrackedView.current) return;

        hasTrackedView.current = true;

        updateProfileViews(loggedInUser.id, userId).catch((err) => {
            console.error("[UserProfile] Failed to update profile views:", err);
        });
    }, [loggedInUser?.id, userId]);

    if (userId === null) {
        return <div>Invalid Profile ID</div>;
    }


    return (
        <main className="min-h-screen w-full flex gap-5 py-5">
            <div className="w-full md:w-[70%] space-y-5">
                <UserInfo
                    profileUser={profileData}
                    isLoading={isPending}
                    company={company}
                    isOrg={isOrg}
                />

                <AboutMe
                    profileUser={profileData}
                    isLoading={isPending}
                    company={company}
                    isOrg={isOrg}
                />

                {!isOrg && profileData && (
                    <>
                        <Education
                            educations={profileData?.educations}
                            profileUserId={profileData?.id}
                            isLoading={isPending}
                        />
                        <Projects
                            projects={profileData?.projects}
                            profileUserId={profileData?.id}
                            isLoading={isPending}
                        />
                        <Experiences
                            experiences={profileData?.experiences}
                            profileUserId={profileData?.id}
                            isLoading={isPending}
                        />
                    </>
                )}

                {/* {isOrg && profileData && (
          <CompanySlides company={company} profileUser={profileData} />
        )} */}
            </div>

            <aside className="hidden md:block md:w-[30%] sticky top-10">
                <MoreProfiles profileUser={profileData} />
            </aside>
        </main>
    );
};

export default UserProfileClient;