'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Prisma } from '@prisma/client';

import { getWhoViewedYourProfile } from '@/actions/premiumFeatures/getWhoviwedYouProfile';

import EmployeesSkeleton from '@/Skeletons/EmployeesSkeleton';
import JobListsSkeleton from '@/Skeletons/JobListsSkeleten';

import JobList from '../jobs/JobLists/JobList';
import NetworkUser from '../network/NetworkUser';

// ================= TYPES =================

// Job with company
type JobWithCompany = Prisma.JobGetPayload<{
    include: { company: true };
}>;

// User with relations
type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        postedJobs: {
            include: {
                company: true;
            };
        };
    };
}>;

type DashboardType =
    | 'appliedJobs'
    | 'postedJobs'
    | 'actionTaken'
    | 'savedJobs'
    | 'profileViews';

interface ShowAllProps {
    user: UserWithRelations;
    type?: DashboardType;
    postedJobs?: JobWithCompany[];
    appliedJobs?: JobWithCompany[];
    actionTaken?: JobWithCompany[];
    savedJobs?: JobWithCompany[];
    isLoading?: boolean;
}

// ================= COMPONENT =================

const ShowAll = ({
    user,
    type,
    postedJobs = [],
    appliedJobs = [],
    actionTaken = [],
    savedJobs = [],
    isLoading,
}: ShowAllProps) => {
    // ✅ Select jobs cleanly
    const jobs = useMemo(() => {
        switch (type) {
            case 'appliedJobs':
                return appliedJobs;
            case 'postedJobs':
                return postedJobs;
            case 'actionTaken':
                return actionTaken;
            case 'savedJobs':
                return savedJobs;
            default:
                return [];
        }
    }, [type, appliedJobs, postedJobs, actionTaken, savedJobs]);

    // ✅ Profile viewers query
    const { data: profileViewUsers = [], isPending } = useQuery({
        queryKey: ['profileViews', user.ProfileViews],
        queryFn: () =>
            getWhoViewedYourProfile(user.ProfileViews ?? []),
        enabled: type === 'profileViews' && user.ProfileViews?.length > 0,
    });

    // ================= PROFILE VIEWS =================
    if (type === 'profileViews') {
        return (
            <div className="space-y-4">
                {isPending ? (
                    <EmployeesSkeleton />
                ) : profileViewUsers.length === 0 ? (
                    <EmptyState text="No one has viewed your profile yet" />
                ) : (
                    profileViewUsers.map((u: any) => (
                        <NetworkUser key={u.id} networkUser={u} />
                    ))
                )}
            </div>
        );
    }

    // ================= JOB LIST =================
    return (
        <div className="space-y-4">
            {isLoading ? (
                <JobListsSkeleton isDash />
            ) : jobs.length === 0 ? (
                <EmptyState text="No jobs found" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="group border rounded-2xl p-4 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <JobList
                                job={job}
                                appliedJob="dashboard"
                                app_or_pos={
                                    type === 'postedJobs' ? 'posted' : 'applied'
                                }
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowAll;

// ================= EMPTY STATE =================

const EmptyState = ({ text }: { text: string }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-500">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">{text}</p>
        </div>
    );
};