import { getNetworkusers } from "@/actions/user/get-network-users";
import NetworkClient from "../NetworkClient";

interface NetworkPageProps {
    params: Promise<{
        userId: string;
    }>;
}

const NetworkPage = async ({
    params,
}: NetworkPageProps) => {
    const { userId: userIdParam } =
        await params;

    const userId = Number(userIdParam);

    if (!Number.isInteger(userId)) {
        return (
            <div className="p-5 text-sm text-red-500">
                Invalid user ID
            </div>
        );
    }

    const result = await getNetworkusers(
        userId,
        "followers"
    );

    return (
        <NetworkClient
            userId={userId}
            initialUsers={
                result.data ?? []
            }
        />
    );
};

export default NetworkPage;