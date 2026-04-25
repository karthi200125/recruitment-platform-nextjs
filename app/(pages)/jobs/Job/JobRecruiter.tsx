'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, UserCircle2, Crown, Lock } from 'lucide-react';

import { getUserById } from '@/actions/auth/getUserById';
import { openModal } from '@/app/Redux/ModalSlice';
import Model from '@/components/Model/Model';
import MessageBox from '../../messages/MessageBox';
import JobRecruiterSkeleton from '@/Skeletons/JobRecruiterSkeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';

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
    company: Company | undefined;
    isPending?: boolean;
}

const JobRecruiter: React.FC<JobRecruiterProps> = ({ job, company, isPending = false }) => {
    const dispatch = useDispatch();
    const { user: currentUser } = useCurrentUser();

    const { data: recruiter, isLoading, isError } = useQuery<RecruiterUser>({
        queryKey: ['recruiter', job.userId],
        queryFn: async () => {
            const { data } = await getUserById(job.userId);
            return data as RecruiterUser;
        },
        enabled: !!job?.userId,
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading || isPending) return <JobRecruiterSkeleton />;
    if (isError || !recruiter) return null;

    const canMessage = !!currentUser?.isPro;

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 space-y-4">

            {/* Header */}
            <div className="flex items-center gap-2">
                <UserCircle2 className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                <h3 className="text-sm font-bold text-slate-800">Meet the Hiring Team</h3>
            </div>

            {/* Recruiter card */}
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <Link href={`/userProfile/${recruiter.id}`} className="flex-shrink-0">
                    <div className="relative">
                        <Image
                            src={recruiter.userImage || '/noProfile.webp'}
                            alt={recruiter.username}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                        {recruiter.isPro && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                                <Crown className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                            </div>
                        )}
                    </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/userProfile/${recruiter.id}`}
                        className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors duration-200 block truncate"
                    >
                        {recruiter.username}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {recruiter.profession || 'Recruiter'}{company?.companyName ? ` · ${company.companyName}` : ''}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-medium text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5">
                        Job poster
                    </span>
                </div>

                {/* Message button */}
                <button
                    onClick={() => canMessage && dispatch(openModal(`messageModel-${recruiter.id}`))}
                    disabled={!canMessage}
                    title={!canMessage ? "Upgrade to Premium to message recruiters" : `Message ${recruiter.username}`}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold border transition-all duration-200 ${
                        canMessage
                            ? "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                            : "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                >
                    {canMessage
                        ? <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
                        : <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                    }
                    Message
                </button>
            </div>

            {/* Premium lock hint */}
            {!canMessage && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
                    <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" strokeWidth={2} />
                    <p className="text-xs text-amber-700">
                        <span className="font-semibold">Premium</span> members can message recruiters directly.{" "}
                        <Link href="/subscription" className="underline underline-offset-2 hover:text-amber-800 transition-colors">
                            Upgrade
                        </Link>
                    </p>
                </div>
            )}

            {/* Message modal */}
            <Model
                modalId={`messageModel-${recruiter.id}`}
                title={`Message ${recruiter.username}`}
                className="min-w-[300px] lg:w-[800px]"
                bodyContent={<MessageBox receiverId={recruiter.id} chatUser={recruiter} />}
            >
                <div />
            </Model>
        </div>
    );
};

export default JobRecruiter;