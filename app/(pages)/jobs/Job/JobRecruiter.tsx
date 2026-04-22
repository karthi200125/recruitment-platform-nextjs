'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { getUserById } from '@/actions/auth/getUserById';
import { openModal } from '@/app/Redux/ModalSlice';
import Button from '@/components/Button';
import Model from '@/components/Model/Model';
import MessageBox from '../../messages/MessageBox';
import JobRecruiterSkeleton from '@/Skeletons/JobRecruiterSkeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// ✅ TYPES BASED ON YOUR PRISMA SCHEMA

type Role = 'CANDIDATE' | 'RECRUITER' | 'ORGANIZATION';

interface RecruiterUser {
    id: number;
    username: string;
    userImage?: string | null;
    profession?: string | null;
    role: Role;
    isPro: boolean;
}

interface Job {
    id: number;
    userId: number;
}

interface Company {
    id: number;
    companyName: string;
}

interface JobRecruiterProps {
    job: Job;
    company: Company;
    isPending?: boolean;
}

const JobRecruiter: React.FC<JobRecruiterProps> = ({
    job,
    company,
    isPending = false,
}) => {
    const dispatch = useDispatch();
    const { user: currentUser } = useCurrentUser();

    // ✅ FETCH RECRUITER (JOB POSTER)
    const {
        data: recruiter,
        isLoading,
        isError,
    } = useQuery<RecruiterUser>({
        queryKey: ['recruiter', job.userId],
        queryFn: async () => {
            const { data } = await getUserById(job.userId);

            return data as RecruiterUser;
        },
        enabled: !!job?.userId,
        staleTime: 1000 * 60 * 5, // cache 5 mins
    });

    // ✅ LOADING STATE
    if (isLoading || isPending) {
        return <JobRecruiterSkeleton />;
    }

    // ✅ ERROR / NO DATA
    if (isError || !recruiter) {
        return null;
    }

    return (
        <div className="relative w-full border rounded-[10px] min-h-[100px] p-5 space-y-3">
            <h3 className="font-bold">Meet The Hiring Team</h3>

            <div className="flex flex-row items-start gap-5">
                {/* Profile Image */}
                <Image
                    width={50}
                    height={50}
                    src={recruiter.userImage || '/noProfile.webp'}
                    alt={recruiter.username}
                    className="bg-neutral-200 rounded-full object-cover"
                />

                {/* Info */}
                <div className="space-y-1">
                    <Link
                        href={`/userProfile/${recruiter.id}`}
                        className="font-bold hover:underline"
                    >
                        {recruiter.username}
                    </Link>

                    <h5>
                        {recruiter.profession || 'Recruiter'} at{' '}
                        {company.companyName}
                    </h5>

                    <h6 className="text-[var(--lighttext)]">Job poster</h6>
                </div>

                {/* Message Button */}
                <Button
                    onClick={() =>
                        dispatch(openModal(`messageModel-${recruiter.id}`))
                    }
                    disabled={!currentUser?.isPro}
                    variant="border"
                    className="absolute top-3 right-3"
                >
                    Message
                </Button>
            </div>

            {/* Message Modal */}
            <Model
                modalId={`messageModel-${recruiter.id}`}
                title={`Message ${recruiter.username}`}
                className="min-w-[300px] lg:w-[800px]"
                bodyContent={
                    <MessageBox
                        receiverId={recruiter.id}
                        chatUser={recruiter}
                    />
                }
            >
                <div />
            </Model>
        </div>
    );
};

export default JobRecruiter;