"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import { updateProfileViews } from "@/actions/user/update-profile-views";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ProfileViewTracker() {
    const { user: loggedInUser } = useCurrentUser();
    const params = useParams();

    const rawUserId = params?.userId;

    const userId =
        typeof rawUserId === "string" &&
            /^\d+$/.test(rawUserId)
            ? Number(rawUserId)
            : null;

    const hasTrackedView = useRef(false);

    useEffect(() => {
        if (!loggedInUser?.id || userId === null) {
            return;
        }

        if (loggedInUser.id === userId) {
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
                "[ProfileViewTracker] Failed to update profile views:",
                error
            );
        });
    }, [
        loggedInUser?.id,
        userId,
    ]);

    return null;
}