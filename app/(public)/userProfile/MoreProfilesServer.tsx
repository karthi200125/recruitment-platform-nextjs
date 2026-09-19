import { getSuggestedUsers } from "@/actions/user/more-profile-users";
import MoreProfiles from "./MoreProfiles";

interface MoreProfilesServerProps {
    profileUserId: number;
    currentUser?: {
        id: number;
        isPro: boolean;
    } | null;
}

const MoreProfilesServer = async ({
    profileUserId,
    currentUser,
}: MoreProfilesServerProps) => {
    const moreUsers =
        await getSuggestedUsers(profileUserId);

    if (!moreUsers) {
        return null;
    }

    return (
        <MoreProfiles
            profileUserId={profileUserId}
            suggestedUsers={moreUsers}
            currentUser={currentUser}
        />
    );
};

export default MoreProfilesServer;