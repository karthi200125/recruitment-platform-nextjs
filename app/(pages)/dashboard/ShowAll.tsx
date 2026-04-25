"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Users } from "lucide-react";
import { Prisma } from "@prisma/client";

import { getWhoViewedYourProfile } from "@/actions/premiumFeatures/getWhoviwedYouProfile";
import JobList from "../jobs/JobLists/JobList";
import NetworkUser from "../network/NetworkUser";

type JobWithCompany = Prisma.JobGetPayload<{
    include: { company: true };
}>;

type UserWithRelations = Prisma.UserGetPayload<{
    include: { postedJobs: true };
}>;

type DashboardType = "appliedJobs" | "postedJobs" | "savedJobs" | "profileViews";

interface ShowAllProps {
    user: UserWithRelations;
    type: DashboardType;
    postedJobs?: JobWithCompany[];
    appliedJobs?: JobWithCompany[];
    savedJobs?: JobWithCompany[];
}

function EmptyState({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Icon className="w-6 h-6 text-slate-400" strokeWidth={1.75} />
            </div>
            <p className="text-base font-semibold text-slate-600">{title}</p>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">{subtitle}</p>
        </div>
    );
}

function ProfileViewsSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-white animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-1/3 rounded-lg bg-slate-200" />
                        <div className="h-3 w-1/4 rounded-lg bg-slate-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

const EMPTY_STATES: Record<DashboardType, { icon: React.ElementType; title: string; subtitle: string }> = {
    appliedJobs: { icon: Briefcase, title: "No applications yet", subtitle: "Start exploring jobs and apply to roles that match your skills." },
    postedJobs: { icon: Briefcase, title: "No jobs posted yet", subtitle: "Create your first job listing to start receiving applications." },
    savedJobs: { icon: Briefcase, title: "No saved jobs yet", subtitle: "Bookmark jobs you're interested in to revisit them later." },
    profileViews: { icon: Users, title: "No profile views yet", subtitle: "As you engage on the platform, people will start viewing your profile." },
};

const ShowAll = ({ user, type, postedJobs = [], appliedJobs = [], savedJobs = [] }: ShowAllProps) => {
    const jobs = useMemo(() => {
        switch (type) {
            case "appliedJobs": return appliedJobs;
            case "postedJobs": return postedJobs;
            case "savedJobs": return savedJobs;
            default: return [];
        }
    }, [type, appliedJobs, postedJobs, savedJobs]);

    const { data: viewers = [], isPending: isViewersPending } = useQuery({
        queryKey: ["profileViews", user.ProfileViews],
        queryFn: () => getWhoViewedYourProfile(user.ProfileViews ?? []),
        enabled: type === "profileViews",
    });

    const empty = EMPTY_STATES[type];

    if (type === "profileViews") {
        if (isViewersPending) return <ProfileViewsSkeleton />;
        if (viewers.length === 0) return <EmptyState {...empty} />;
        return (
            <div className="space-y-3">
                {viewers.map((u: any) => (
                    <div key={u.id} className="rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-200">
                        <NetworkUser networkUser={u} />
                    </div>
                ))}
            </div>
        );
    }

    if (jobs.length === 0) return <EmptyState {...empty} />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map((job) => (
                <div
                    key={job.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                >
                    <JobList job={job} appliedJob="dashboard" />
                </div>
            ))}
        </div>
    );
};

export default ShowAll;