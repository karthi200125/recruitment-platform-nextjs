"use client";

import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";

import RecruiterCard from "./RecruiterCard";
import InviteRecruiterSearchInput from "./InviteRecruiterSearchInput";

import type {
    RecruiterSearchResult,
} from "@/types/company-employee";
import { searchRecruiters } from "@/actions/company/searchRecruiters";
import { inviteRecruiter } from "@/actions/company/inviteRecruiter";

const InviteRecruiter = () => {
    const [search, setSearch] = useState("");

    const [recruiters, setRecruiters] = useState<
        RecruiterSearchResult[]
    >([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loadingRecruiterId, setLoadingRecruiterId] =
        useState<number | null>(null);

    const [invitedRecruiters, setInvitedRecruiters] =
        useState<number[]>([]);

    useEffect(() => {
        const keyword = search.trim();

        if (keyword.length < 2) {
            setRecruiters([]);
            setError("");
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                setError("");

                const result =
                    await searchRecruiters(keyword);

                setRecruiters(result);
            } catch (err) {
                console.error(err);

                setRecruiters([]);

                setError(
                    "Failed to search recruiters."
                );
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);


    const handleInvite = async (
        recruiterId: number
    ) => {
        try {
            setLoadingRecruiterId(
                recruiterId
            );

            await inviteRecruiter({
                recruiterId,
            });

            setInvitedRecruiters(
                (previous) => [
                    ...previous,
                    recruiterId,
                ]
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingRecruiterId(
                null
            );
        }
    };

    return (
        <div className="flex max-h-[75vh] flex-col">

            <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-2xl font-bold text-slate-900">
                    Invite Recruiter
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Search recruiters by
                    username or email and
                    invite them to join your
                    company.
                </p>
            </div>

            <div className="border-b border-slate-200 px-6 py-5">
                <InviteRecruiterSearchInput
                    value={search}
                    onChange={setSearch}
                    isLoading={loading}
                />
            </div>


            <div className="flex-1 overflow-y-auto px-6 py-5">

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    search.trim().length >= 2 &&
                    recruiters.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <SearchX className="h-14 w-14 text-slate-300" />

                            <h3 className="mt-5 text-lg font-semibold text-slate-900">
                                No recruiters found
                            </h3>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Try searching using a
                                different username
                                or email address.
                            </p>
                        </div>
                    )}

                {recruiters.length > 0 && (
                    <div className="space-y-4">
                        {recruiters.map((recruiter) => (
                            <RecruiterCard
                                key={recruiter.id}
                                recruiter={recruiter}
                                loading={
                                    loadingRecruiterId ===
                                    recruiter.id
                                }
                                invited={invitedRecruiters.includes(
                                    recruiter.id
                                )}
                                onInvite={handleInvite}
                            />
                        ))}
                    </div>
                )}

                {!loading &&
                    search.trim().length < 2 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <SearchX className="h-14 w-14 text-slate-300" />

                            <h3 className="mt-5 text-lg font-semibold text-slate-900">
                                Search Recruiters
                            </h3>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Start typing at least two
                                characters to search
                                recruiters by username or
                                email.
                            </p>
                        </div>
                    )}
            </div>

            <div className="flex items-center justify-end border-t border-slate-200 px-6 py-5">
                <button
                    type="button"
                    data-close-modal
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default InviteRecruiter;