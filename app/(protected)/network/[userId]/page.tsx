
import { getNetworkusers } from "@/actions/user/get-network-users";
import { getUserProfileUserById } from "@/actions/user/getuser/getUserProfileUserById";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NetworkClient from "../NetworkClient";

interface Props { params: Promise<{ userId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { userId: raw } = await params;
    const userId = Number(raw);
    if (!Number.isInteger(userId)) return { title: "Network" };
    const result = await getUserProfileUserById(userId);
    const name = result.data?.username ?? "User";
    return {
        title: `${name}'s Network`,
        description: `Followers and following of ${name} on Jobify.`,
    };
}

const NetworkPage = async ({ params }: Props) => {
    const { userId: raw } = await params;
    const userId = Number(raw);
    if (!Number.isInteger(userId)) notFound();

    const [followersRes, followingRes, profileRes] = await Promise.all([
        getNetworkusers(userId, "followers"),
        getNetworkusers(userId, "followings"),
        getUserProfileUserById(userId),
    ]);

    if (!profileRes.success || !profileRes.data) notFound();

    return (
        <NetworkClient
            userId={userId}
            profileUser={profileRes.data}
            initialFollowers={followersRes.data ?? []}
            initialFollowing={followingRes.data ?? []}
        />
    );
};

export default NetworkPage;