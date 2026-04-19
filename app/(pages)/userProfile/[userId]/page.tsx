"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getUserById, ProfileUser } from "@/actions/auth/getUserById";
import { updateProfileViews } from "@/actions/user/profileViews";

import AboutMe from "../AboutMe";
import CompanySlides from "../CompanySlides/CompanySlides";
import Education from "../Educations";
import Experiences from "../Experiences";
import MoreProfiles from "../MoreProfiles";
import Projects from "../Projects";
import UserInfo from "../UserInfo";

interface AuthUser {
  id: number;
  role?: string;
}

interface RootState {
  user: { user: AuthUser | null };
}

const UserProfile = () => {
  const loggedInUser = useSelector((state: RootState) => state.user.user);

  const params = useParams();
  const rawUserId = params?.userId;

  const userId =
    typeof rawUserId === "string" && /^\d+$/.test(rawUserId)
      ? Number(rawUserId)
      : null;

  const hasTrackedView = useRef(false);

  const {
    data: profileData,
    isPending,
    isError,
    refetch,
  } = useQuery<ProfileUser>({
    queryKey: ["getuser", userId],
    queryFn: async () => {
      const res = await getUserById(userId!);

      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch user");
      }

      return res.data; 
    },
    enabled: userId !== null,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  
  const company = profileData?.company?.[0] ?? null;
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

  if (isError) {
    return (
      <div>
        Failed to load profile.
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

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
            <Education userId={userId} profileUser={profileData} />
            <Projects userId={userId} profileUser={profileData} />
            <Experiences userId={userId} profileUser={profileData} />
          </>
        )}

        {isOrg && profileData && (
          <CompanySlides company={company} profileUser={profileData} />
        )}
      </div>

      <aside className="hidden md:block md:w-[30%]">
        {!isPending && <MoreProfiles userId={userId} />}
      </aside>
    </main>
  );
};

export default UserProfile;