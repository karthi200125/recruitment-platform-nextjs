export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

import SettingsClient from "./SettingsClient";
import { getAccountData } from "@/actions/setting/get-settings-data";

export default async function SettingsPage() {
    const user = await getAccountData();

    if (!user) {
        redirect("/signin");
    }

    return (
        <div className="mx-auto w-full max-w-6xl">
            <SettingsClient user={user} />
        </div>
    );
}