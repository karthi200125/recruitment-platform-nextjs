'use client';

import FilterNavbar from '@/components/FilterNavbar/FilterNavbar';
import JobLists from './JobLists/JobLists';
import JobDetails from './Job/JobDetails';
import { JobWithCompany } from '@/actions/job/getFilterAllJobs';
import { Briefcase } from 'lucide-react';

interface Props {
  jobs: JobWithCompany[];
  job: JobWithCompany | null;
  isPending: boolean;
  onSelectedJob: (id: number) => void;
  count: number;
  currentPage: number;
  safeSearchParams: any;
}

function NoJobSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Briefcase className="w-7 h-7 text-slate-300" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-600 mb-1">Select a job</p>
        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
          Click any listing on the left to view full job details, description, and apply.
        </p>
      </div>
    </div>
  );
}

const Jobb = ({
  jobs,
  job,
  count,
  currentPage,
  isPending,
  onSelectedJob,
  safeSearchParams,
}: Props) => {
  return (
    <div className="flex h-[calc(100vh-60px)] flex-col bg-white overflow-hidden">

      {/* Filter bar */}
      <div className="border-b border-slate-100 bg-white z-20">
        <FilterNavbar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Job list */}
        <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col border-r border-slate-100 overflow-hidden bg-white">
          <JobLists
            jobs={jobs}
            isLoading={isPending}
            onSelectedJob={onSelectedJob}
            count={count}
            currentPage={currentPage}
            selectedJobId={job?.id ?? null}
          />
        </div>

        {/* RIGHT — Job details */}
        <div className="hidden md:flex flex-col flex-1 overflow-hidden">
          {job
            ? <JobDetails job={job} safeSearchParams={safeSearchParams} />
            : <NoJobSelected />
          }
        </div>
      </div>
    </div>
  );
};

export default Jobb;