'use client';

import Image from 'next/image';
import moment from 'moment';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { JobWithCompany } from '@/actions/job/getFilterAllJobs';

import noImage from '@/public/noImage.webp';

interface JobListProps {
  job: JobWithCompany; 
  selectedJob?: number | null;
  isHover?: boolean;
  border?: boolean;
}

const JobList = ({
  job,
  selectedJob,
  isHover,
  border,
}: JobListProps) => {
  const { user } = useCurrentUser();


  const isApplied = false; 

  return (
    <div
      className={`
        ${job.id === selectedJob ? 'bg-neutral-100 border-l-black' : ''}
        ${isHover ? 'hover:bg-neutral-100' : ''}
        ${border ? 'border-b' : ''}
        w-full p-4 border-l-4 border-l-transparent
      `}
    >
      <div className="flex gap-4">
        <Image
          src={job.company?.companyImage || noImage}
          alt="Company"
          width={60}
          height={60}
          className="rounded-md object-cover"
        />

        <div className="flex-1">
          <h3 className="font-bold">{job.jobTitle}</h3>

          <p className="text-sm text-neutral-500">
            {job.company?.companyName}
          </p>

          <p className="text-xs">
            {job.city}, {job.state}, {job.country}
          </p>

          <p className="text-xs">
            {moment(job.createdAt).fromNow()}
          </p>

          {isApplied && (
            <span className="text-xs text-green-600 font-semibold">
              Applied
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;