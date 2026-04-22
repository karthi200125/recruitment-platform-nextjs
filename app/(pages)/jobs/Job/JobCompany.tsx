'use client';

import Image from 'next/image';
import Link from 'next/link';

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
  isFollowing?: boolean; // ✅ optional now
}

const JobCompany: React.FC<JobCompanyProps> = ({
  company,
  isPending = false,
  isFollowing,
}) => {
  if (isPending) {
    return <JobCompanySkeleton />;
  }

  return (
    <div className="w-full border rounded-[10px] min-h-[100px] p-5 space-y-5">
      <h3 className="font-bold">About The Company</h3>

      <div className="flex flex-row items-start justify-between">
        {/* LEFT */}
        <div className="flex flex-row items-center gap-5">
          <div className="w-[40px] md:w-[100px] h-[40px] md:h-[100px] rounded-md overflow-hidden relative">
            <Image
              src={company.companyImage || noImage.src}
              alt={company.companyName}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1">
            <Link
              href={`/company/${company.id}`}
              className="font-semibold capitalize flex items-center gap-3"
            >
              {company.companyName}
              <Batch type="ORGANIZATION" />
            </Link>

            <h4 className="font-bold">Followers</h4>

            <h6>{company.companyTotalEmployees} Employees</h6>
          </div>
        </div>

        {/* RIGHT */}
        <FollowButton
          targetUserId={company.userId}
          initialIsFollowing={isFollowing} // optional
          className="min-w-[110px]"
        />
      </div>

      <h5 className="text-[var(--lighttext)]">
        {company.companyAbout}
      </h5>
    </div>
  );
};

export default JobCompany;