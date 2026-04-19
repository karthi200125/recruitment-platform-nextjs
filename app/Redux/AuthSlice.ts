import { Role } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export interface AuthUser {
    id: number;
    username?: string;
    email?: string;
    role?: Role;
    isPro?: boolean;

    savedJobs: number[];
    followings: number[];
}

interface AuthState {
    user: AuthUser | null;
}

/* ================= STORAGE ================= */

const STORAGE_KEY = "auth_user";

const loadUserFromStorage = (): AuthUser | null => {
    if (typeof window === "undefined") return null;

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;

        const parsed: AuthUser = JSON.parse(data);

        // Ensure arrays always exist (important!)
        return {
            ...parsed,
            savedJobs: parsed.savedJobs ?? [],
            followings: parsed.followings ?? [],
        };
    } catch (err) {
        console.error("[AuthSlice] Storage parse error:", err);
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
};

const saveUserToStorage = (user: AuthUser | null) => {
    if (typeof window === "undefined") return;

    if (!user) {
        localStorage.removeItem(STORAGE_KEY);
        return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

/* ================= HELPERS ================= */

// reusable toggle helper (clean & testable)
const toggleId = (list: number[], id: number): number[] => {
    return list.includes(id)
        ? list.filter((item) => item !== id)
        : [...list, id];
};

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
    user: loadUserFromStorage(),
};

/* ================= SLICE ================= */

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        toggleSavedJob(state, action: PayloadAction<number>) {
            if (!state.user) return;

            state.user.savedJobs = toggleId(
                state.user.savedJobs || [],
                action.payload
            );

            saveUserToStorage(state.user);
        },

        toggleFollowUser(state, action: PayloadAction<number>) {
            if (!state.user) return;

            state.user.followings = toggleId(
                state.user.followings || [],
                action.payload
            );

            saveUserToStorage(state.user);
        },
    },
});

/* ================= EXPORTS ================= */

export const { toggleSavedJob, toggleFollowUser } = authSlice.actions;

export default authSlice.reducer;