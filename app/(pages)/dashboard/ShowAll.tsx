"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Prisma } from "@prisma/client";

import { getWhoViewedYourProfile } from "@/actions/premiumFeatures/getWhoviwedYouProfile";

import JobList from "../jobs/JobLists/JobList";
import NetworkUser from "../network/NetworkUser";

type JobWithCompany = Prisma.JobGetPayload<{
    include: { company: true };
}>;

type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        postedJobs: true;
    };
}>;

type DashboardType =
    | "appliedJobs"
    | "postedJobs"
    | "savedJobs"
    | "profileViews";

interface ShowAllProps {
    user: UserWithRelations;
    type: DashboardType;
    postedJobs?: JobWithCompany[];
    appliedJobs?: JobWithCompany[];
    savedJobs?: JobWithCompany[];
}

const ShowAll = ({
    user,
    type,
    postedJobs = [],
    appliedJobs = [],
    savedJobs = [],
}: ShowAllProps) => {
    const jobs = useMemo(() => {
        switch (type) {
            case "appliedJobs":
                return appliedJobs;
            case "postedJobs":
                return postedJobs;
            case "savedJobs":
                return savedJobs;
            default:
                return [];
        }
    }, [type, appliedJobs, postedJobs, savedJobs]);

    // Profile views
    const { data: users = [], isPending } = useQuery({
        queryKey: ["profileViews", user.ProfileViews],
        queryFn: () => getWhoViewedYourProfile(user.ProfileViews ?? []),
        enabled: type === "profileViews",
    });

    if (type === "profileViews") {
        return (
            <div className="space-y-4">
                {isPending ? (
                    <p>Loading...</p>
                ) : users.length === 0 ? (
                    <Empty text="No profile views yet" />
                ) : (
                    users.map((u: any) => (
                        <NetworkUser key={u.id} networkUser={u} />
                    ))
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs.length === 0 ? (
                <Empty text="No jobs found" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="border rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition"
                        >
                            <JobList job={job} appliedJob="dashboard" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowAll;

const Empty = ({ text }: { text: string }) => (
    <div className="text-center py-16 text-neutral-500">
        <div className="text-4xl mb-2">📭</div>
        <p>{text}</p>
    </div>
);