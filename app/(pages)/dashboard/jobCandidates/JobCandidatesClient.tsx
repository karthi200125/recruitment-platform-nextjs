'use client';

import { useState } from 'react';
import moment from 'moment';
import { FaSuitcase, FaUsers } from 'react-icons/fa';
import { FaListCheck } from 'react-icons/fa6';
import { Prisma } from '@prisma/client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import JobDescription from '../../jobs/Job/JobDescription';
import Candidates from './Candidates';

// ================= TYPES =================

// Job type
type JobType = Prisma.JobGetPayload<{
  include: {
    jobApplications: true;
  };
}>;

// Candidate type
type CandidateApplication = Prisma.JobApplicationGetPayload<{
  include: {
    user: true;
    job: true;
  };
}>;

type CandidateFilter = 'EarlyApplicants' | 'TopApplicants';

interface JobCandidatesClientProps {
  job: JobType;
  candidates: CandidateApplication[];
}

// ================= COMPONENT =================

const JobCandidatesClient = ({
  job,
  candidates,
}: JobCandidatesClientProps) => {
  const [type, setType] = useState<CandidateFilter>('EarlyApplicants');

  return (
    <div className="min-h-screen w-full px-2 md:px-4 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ================= LEFT: JOB ================= */}
        <div className="xl:col-span-2 space-y-5">
          <div className="rounded-2xl border p-5 bg-white/70 backdrop-blur-sm shadow-sm space-y-4">

            {/* Title */}
            <h1 className="text-xl font-semibold capitalize">
              {job.jobTitle}
            </h1>

            {/* Meta */}
            <p className="text-sm text-neutral-500">
              {job.city}, {job.state}, {job.country} ·{' '}
              {moment(job.createdAt).fromNow()} ·{' '}
              {candidates.length} applicants
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <FaSuitcase size={16} />
              <span className="px-3 py-1 rounded-lg bg-neutral-100 text-sm">
                {job.mode}
              </span>
              <span className="px-3 py-1 rounded-lg bg-neutral-100 text-sm">
                {job.type}
              </span>
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <FaListCheck size={16} />
              <span>Skills match analysis (coming soon 🚀)</span>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border p-5 bg-white/70 backdrop-blur-sm shadow-sm">
            <JobDescription job={job} isPending={false} />
          </div>
        </div>

        {/* ================= RIGHT: CANDIDATES ================= */}
        <div className="space-y-4">
          <div className="rounded-2xl border p-5 bg-white/70 backdrop-blur-sm shadow-sm space-y-4">

            {/* Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <FaUsers size={18} />
                <h2 className="font-semibold">
                  Candidates ({candidates.length})
                </h2>
              </div>

              {/* Filter */}
              <Select value={type} onValueChange={(v: CandidateFilter) => setType(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="EarlyApplicants">
                      Early Applicants
                    </SelectItem>
                    <SelectItem value="TopApplicants">
                      Top Applicants
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* List */}
            <div className="max-h-[500px] overflow-y-auto pr-1">
              <Candidates
                job={job}
                candidates={candidates}
                isPending={false}
                type={type}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobCandidatesClient;