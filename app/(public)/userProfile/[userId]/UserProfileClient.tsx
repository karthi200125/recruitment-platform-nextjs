import AboutMe from "../AboutMe";
import CompanySlides from "../CompanySlides/CompanySlides";
import Education from "../Educations";
import Experiences from "../Experiences";
import MoreProfiles from "../MoreProfiles";
import Projects from "../project/Projects";
import UserInfo from "../UserInfo";
import ProfileResume from "../ProfileResume";

import {
    ProfileUser,
    isCandidateRecruiterProfile,
    isOrganizationProfile,
} from "@/types/userProfile";

import dynamic from "next/dynamic";
import { MoreProfileUser } from "@/actions/user/more-profile-users";

const ProfileViewTracker = dynamic(
    () => import("../ProfileViewTracker"),
    {
        ssr: false,
    }
);

interface UserProfileProps {
    initialProfile: ProfileUser;
    moreUsers: MoreProfileUser[];
}

const UserProfile = ({
    initialProfile,
    moreUsers,
}: UserProfileProps) => {
    const profileData = initialProfile;

    if (!profileData) {
        return null;
    }

    const isOrganization =
        isOrganizationProfile(profileData);

    const isCandidateRecruiter =
        isCandidateRecruiterProfile(profileData);

    const company = profileData.company ?? null;

    return (
        <>
            <ProfileViewTracker />

            <main className="flex min-h-screen w-full flex-col gap-5 py-6 md:flex-row">

                {/* Main column */}
                <div className="w-full space-y-5 md:w-[70%]">

                    <UserInfo
                        profileUser={profileData}
                        isLoading={false}
                        company={company}
                        isOrg={isOrganization}
                    />

                    <ProfileResume
                        resume={profileData.resume}
                        resumePublicId={profileData.resumePublicId}
                    />

                    <AboutMe
                        profileUser={profileData}
                        isLoading={false}
                        company={company}
                        isOrg={isOrganization}
                    />

                    {isCandidateRecruiter && (
                        <>
                            <Education
                                educations={profileData.educations}
                                profileUserId={profileData.id}
                                isLoading={false}
                            />

                            <Projects
                                projects={profileData.projects}
                                profileUserId={profileData.id}
                                isLoading={false}
                            />

                            <Experiences
                                experiences={profileData.experiences}
                                profileUserId={profileData.id}
                                isLoading={false}
                            />
                        </>
                    )}

                    {isOrganization && (
                        <CompanySlides
                            company={profileData.company}
                            profileUser={profileData}
                        />
                    )}
                </div>

                {/* Sidebar */}
                <aside className="sticky top-20 hidden max-h-max w-[30%] self-start space-y-5 overflow-y-auto md:block">
                    <MoreProfiles
                        profileUser={profileData}
                        suggestedUsers={moreUsers}
                    />
                </aside>

            </main>
        </>
    );
};

export default UserProfile;