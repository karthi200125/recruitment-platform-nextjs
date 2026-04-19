'use client';

import { useRouter } from 'next/navigation';
import { GoPlus } from 'react-icons/go';
import { IoIosPeople } from 'react-icons/io';

import { Prisma } from '@prisma/client';

import Button from '@/components/Button';
import AppliedCounts from './AppliedCounts';
import ShowAll from './ShowAll';
import ShowJobs from './ShowJobs';

type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        postedJobs: {
            include: {
                company: true;
            };
        };
    };
}>;

type JobWithCompany = Prisma.JobGetPayload<{
    include: {
        company: true;
    };
}>;

type DashboardTab =
    | 'appliedJobs'
    | 'postedJobs'
    | 'savedJobs'
    | undefined;

interface DashboardClientProps {
    user: UserWithRelations;
    appliedJobs: JobWithCompany[];
    savedJobs: JobWithCompany[];
    actionTakenJobs: JobWithCompany[];
    searchParams?: Record<string, string | string[] | undefined>;
}

const DashboardClient = ({
    user,
    appliedJobs,
    savedJobs,
    actionTakenJobs,
    searchParams,
}: DashboardClientProps) => {
    const router = useRouter();

    const paramKey = Object.keys(searchParams ?? {})[0] as DashboardTab;

    const isRecruiter = user.role === 'RECRUITER';
    const isCandidate = user.role === 'CANDIDATE';
    const isORG = user.role === 'ORGANIZATION';

    return (
        <div className="w-full min-h-screen pt-5 space-y-5 px-2">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                <h2 className="capitalize">{paramKey || 'Dashboard'}</h2>

                <div className="flex gap-5">
                    {isORG && (
                        <Button
                            variant="border"
                            onClick={() => router.push('/dashboard/employees')}
                            icon={<IoIosPeople size={20} />}
                        >
                            Employees
                        </Button>
                    )}

                    {(isRecruiter || isORG) && (
                        <Button
                            variant="border"
                            onClick={() => router.push('/createJob')}
                            icon={<GoPlus size={20} />}
                        >
                            Create Job
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <AppliedCounts appliedJobs={appliedJobs} user={user} />

            {paramKey && <hr />}

            {/* Conditional Views */}
            {paramKey ? (
                <ShowAll
                    user={user}
                    type={paramKey}
                    postedJobs={user.postedJobs ?? []} 
                    appliedJobs={appliedJobs}
                    actionTaken={actionTakenJobs}
                    savedJobs={savedJobs}
                    isLoading={false}
                />
            ) : (
                <div className="space-y-5">
                    {(isRecruiter || isCandidate) && (
                        <ShowJobs
                            Jobs={appliedJobs}
                            title="Applied Jobs"
                            href="/dashboard?appliedJobs"
                            type="applied"
                        />
                    )}

                    {(isRecruiter || isORG) && (
                        <ShowJobs
                        Jobs={user.postedJobs ?? []} 
                            title="Posted Jobs"
                            href="/dashboard?postedJobs"
                            type="posted"
                        />
                    )}

                    {(isRecruiter || isCandidate) && (
                        <ShowJobs
                            Jobs={savedJobs}
                            title="Saved Jobs"
                            href="/dashboard?savedJobs"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardClient;