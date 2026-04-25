'use client';

import { useSearchParams } from 'next/navigation';
import CustomPagination from '@/components/CustomPagination';
import JobList from './JobList';
import { JobWithCompany } from '@/actions/job/getFilterAllJobs';
import { Briefcase } from 'lucide-react';

interface Props {
  jobs: JobWithCompany[];
  count: number;
  currentPage: number;
  isLoading: boolean;
  onSelectedJob?: (id: number) => void;
  selectedJobId?: number | null;
}

function JobListSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-200 flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-0.5">
              <div className="h-3.5 w-4/5 rounded-lg bg-slate-200" />
              <div className="h-3 w-2/5 rounded-lg bg-slate-100" />
              <div className="flex gap-2 mt-1">
                <div className="h-4 w-16 rounded-full bg-slate-100" />
                <div className="h-4 w-20 rounded-full bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Briefcase className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <p className="text-sm font-semibold text-slate-600">No jobs found</p>
      <p className="text-xs text-slate-400 max-w-[200px]">Try adjusting your filters or search query.</p>
    </div>
  );
}

const JobLists = ({
  jobs,
  count,
  currentPage,
  isLoading,
  onSelectedJob,
  selectedJobId,
}: Props) => {
  if (isLoading) return <JobListSkeleton />;
  if (!jobs.length) return <EmptyState />;

  return (
    <div className="flex flex-col h-full">
      {/* Count */}
      <div className="px-4 py-2.5 border-b border-slate-100 flex-shrink-0">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{count.toLocaleString()}</span> jobs found
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => onSelectedJob?.(job.id)}
            className="cursor-pointer"
          >
            <JobList
              job={job}
              selectedJob={selectedJobId}
              isHover
              border
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="border-t border-slate-100 p-3 flex-shrink-0">
        <CustomPagination
          totalJobsCount={count}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default JobLists;