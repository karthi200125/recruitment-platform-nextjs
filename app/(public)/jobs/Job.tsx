'use client';

import { useState } from 'react';
import { Briefcase } from 'lucide-react';

import FilterNavbar from '@/components/FilterNavbar';
import type { FilteredJob } from "@/actions/job/get-filter-all-jobs";
import type { JobSearchParams } from "@/types";
import JobDetails from '../../../components/Job/JobDetails';
import JobLists from '../../../components/Job/JobLists/JobLists';
import BottomDrawer from '@/components/BottomDrawer';

interface Props {
  jobs: FilteredJob[];
  job: FilteredJob | null;
  isPending: boolean;
  onSelectedJob: (id: number) => void;
  count: number;
  currentPage: number;
  safeSearchParams: JobSearchParams;
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
  // drawer visibility is separate from job selection itself — selecting a
  // job on desktop shouldn't try to "open" anything, and dismissing the
  // drawer on mobile shouldn't clear the selection (reopening should still
  // show the same job, matching how most job-board apps behave)
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  // below `lg`, selecting a job also opens the drawer. Above `lg`, this
  // extra state is simply unused since the drawer only ever renders in the
  // `lg:hidden` context — harmless, no visual effect on desktop.
  const handleSelectJob = (id: number) => {
    onSelectedJob(id);
    setIsMobileDetailsOpen(true);
  };

  return (
    <div className="flex h-[calc(100vh-60px)] flex-col bg-white overflow-hidden">

      {/* Filter bar */}
      <div className="border-b border-slate-100 bg-white z-20">
        <FilterNavbar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Job list. Full width until `lg` (covers mobile + tablet),
            fixed sidebar width from `lg` up, where the inline detail panel
            also appears alongside it. */}
        <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col border-r border-slate-100 overflow-hidden bg-white">
          <JobLists
            jobs={jobs}
            isLoading={isPending}
            onSelectedJob={handleSelectJob}
            count={count}
            currentPage={currentPage}
            selectedJobId={job?.id ?? null}
          />
        </div>

        {/* RIGHT — Job details, desktop only (`lg` and up) */}
        <div className="hidden lg:flex flex-col flex-1 overflow-hidden">
          {job
            ? <JobDetails job={job} safeSearchParams={safeSearchParams} />
            : <NoJobSelected />
          }
        </div>
      </div>

      {/* Mobile/tablet — job details in a bottom drawer instead of a
          hidden panel. Only mounted below `lg`; on desktop this whole
          block is inert since isMobileDetailsOpen never gets acted on
          visually (Drawer itself isn't rendered outside this wrapper). */}
      <div className="lg:hidden">
        <BottomDrawer
          open={isMobileDetailsOpen && !!job}
          onOpenChange={setIsMobileDetailsOpen}
          title={job && <p className="truncate text-sm font-semibold text-slate-900">{job.jobTitle}</p>}
        >
          {job && <JobDetails job={job} safeSearchParams={safeSearchParams} />}
        </BottomDrawer>
      </div>
    </div>
  );
};

export default Jobb;