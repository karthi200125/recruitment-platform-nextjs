'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import BottomDrawer from '@/components/BottomDrawer';
import CustomPagination from '@/components/CustomPagination';

import JobDesc from '../Job/JobDetails';
import JobList from './JobList';
import { JobWithCompany } from '@/actions/job/getFilterAllJobs';

interface JobListsProps {
  jobs: JobWithCompany[]; // ✅ FIXED
  count: number;
  currentPage: number;
  isLoading: boolean;
  onSelectedJob?: (id: number) => void;
}

const JobLists = ({
  jobs,
  count,
  currentPage,
  isLoading,
  onSelectedJob,
}: JobListsProps) => {
  const searchParams = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const location = searchParams.get('location') ?? 'India';

  /**
   * ✅ FIX: null instead of undefined (consistent logic)
   */
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  /**
   * ✅ FIX: correct condition (was broken before)
   */
  useEffect(() => {
    if (jobs.length && selectedJobId === null) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const handleSelectJob = (jobId: number) => {
    setSelectedJobId(jobId);
    onSelectedJob?.(jobId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-[var(--voilet)] text-white p-5">
        <h5 className="text-sm font-bold">
          {query || 'Jobs'} in {location}
        </h5>

        <p className="text-xs">{count} Results</p>
      </div>

      {jobs.length === 0 ? (
        <h4 className="p-4">No Jobs Found</h4>
      ) : (
        jobs.map((job) => (
          <div key={job.id} onClick={() => handleSelectJob(job.id)}>
            {/* Mobile */}
            <div className="md:hidden">
              <BottomDrawer body={<JobDesc job={job} />}>
                <JobList
                  job={job}
                  selectedJob={selectedJobId}
                  isHover
                  border
                />
              </BottomDrawer>
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              <JobList
                job={job}
                selectedJob={selectedJobId}
                isHover
                border
              />
            </div>
          </div>
        ))
      )}

      <div className="h-[100px] flex items-center justify-center">
        <CustomPagination
          totalJobsCount={count}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default JobLists;