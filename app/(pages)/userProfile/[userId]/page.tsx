"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import { updateProfileViews } from "@/actions/user/profileViews";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import AboutMe from "../AboutMe";
import CompanySlides from "../CompanySlides/CompanySlides";
import Education from "../Educations";
import Experiences from "../Experiences";
import MoreProfiles from "../MoreProfiles";
import Projects from "../Projects";
import UserInfo from "../UserInfo";

import { getUserProfileUserById } from "@/actions/user/getuser/getUserProfileUserById";
import { ProfileUser } from "@/types/userProfile";

const UserProfile = () => {
  const session = useCurrentUser();
  const loggedInUser = session?.user;

  const params = useParams();
  const rawUserId = params?.userId;

  // ✅ Safe parsing
  const userId = useMemo(() => {
    if (typeof rawUserId !== "string") return null;
    if (!/^\d+$/.test(rawUserId)) return null;
    return Number(rawUserId);
  }, [rawUserId]);

  const hasTrackedView = useRef(false);

  // ✅ React Query (proper typing)
  const {
    data: profileData,
    isPending,
    isError,
    refetch,
  } = useQuery<ProfileUser>({
    queryKey: ["getUserProfile", userId],
    queryFn: async () => {
      if (userId === null) throw new Error("Invalid user ID");

      const res = await getUserProfileUserById(userId);

      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch user");
      }

      return res.data;
    },
    enabled: userId !== null,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  // ✅ Derived values (safe)
  const company = profileData?.company?.[0] ?? null;
  const isOrg = profileData?.role === "ORGANIZATION";

  // ✅ Track profile view (safe + optimized)
  useEffect(() => {
    if (!loggedInUser?.id || userId === null) return;
    if (loggedInUser.id === userId) return;
    if (hasTrackedView.current) return;

    hasTrackedView.current = true;

    updateProfileViews(loggedInUser.id, userId).catch((err) => {
      console.error("[UserProfile] Failed to update profile views:", err);
    });
  }, [loggedInUser?.id, userId]);

  // ✅ Invalid ID
  if (userId === null) {
    return <div>Invalid Profile ID</div>;
  }

  // ✅ Error state
  if (isError) {
    return (
      <div>
        Failed to load profile.
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  // ✅ Not found
  if (!isPending && !profileData) {
    return <div>Profile not found.</div>;
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

        {isOrg && profileData && (
          <CompanySlides company={company} profileUser={profileData} />
        )}
      </div>

      <aside className="hidden md:block md:w-[30%]">
        <MoreProfiles profileUser={profileData} />
      </aside>
    </main>
  );
};

export default UserProfile;