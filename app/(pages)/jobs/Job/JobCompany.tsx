'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Building2, Users, BadgeCheck } from 'lucide-react';

import Batch from '@/components/Batch';
import JobCompanySkeleton from '@/Skeletons/JobCompanySkeleton';
import FollowButton from '@/components/FollowButton';
import noImage from '../../../../public/noImage.webp';

interface Company {
    id: number;
    companyName: string;
    companyImage?: string | null;
    companyAbout: string;
    companyTotalEmployees: string;
    userId: number;
}

interface JobCompanyProps {
    company: Company;
    isPending?: boolean;
    isFollowing?: boolean;
}

const JobCompany: React.FC<JobCompanyProps> = ({ company, isPending = false, isFollowing }) => {
    if (isPending) return <JobCompanySkeleton />;

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden">

            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

            <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                    <h3 className="text-sm font-bold text-slate-800">About the Company</h3>
                </div>

                {/* Company identity + follow */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Logo */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 relative bg-slate-50">
                            <Image
                                src={company.companyImage || noImage.src}
                                alt={company.companyName}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 space-y-0.5">
                            <Link
                                href={`/company/${company.id}`}
                                className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors duration-200 capitalize"
                            >
                                {company.companyName}
                                <Batch type="ORGANIZATION" />
                            </Link>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Users className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
                                {company.companyTotalEmployees} employees
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <BadgeCheck className="w-3 h-3 flex-shrink-0 text-indigo-400" strokeWidth={2} />
                                Verified company
                            </div>
                        </div>
                    </div>

                    {/* Follow */}
                    <div className="flex-shrink-0">
                        <FollowButton
                            targetUserId={company.userId}
                            initialIsFollowing={isFollowing ?? false}                            
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100" />

                {/* About text */}
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">
                    {company.companyAbout}
                </p>

                {/* View profile link */}
                <Link
                    href={`/company/${company.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                    View company profile
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 6h8M6 2l4 4-4 4" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default JobCompany;