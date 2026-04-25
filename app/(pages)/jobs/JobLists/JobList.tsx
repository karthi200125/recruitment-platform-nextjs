'use client';

import Image from 'next/image';
import moment from 'moment';
import { MapPin, Clock, Briefcase, Users } from 'lucide-react';
import { JobWithCompany } from '@/actions/job/getFilterAllJobs';
import noImage from '@/public/noImage.webp';

interface Props {
  job: JobWithCompany;
  selectedJob?: number | null;
  isHover?: boolean;
  border?: boolean;
}

const MODE_STYLES: Record<string, string> = {
  remote: "bg-emerald-50 text-emerald-700 border-emerald-200",
  hybrid: "bg-violet-50 text-violet-700 border-violet-200",
  onsite: "bg-amber-50 text-amber-700 border-amber-200",
  on_site: "bg-amber-50 text-amber-700 border-amber-200",
};

const JobList = ({ job, selectedJob, isHover, border }: Props) => {
  const isSelected = job.id === selectedJob;
  const modeLower = (job.mode ?? "").toLowerCase().replace(" ", "_");
  const modeBadge = MODE_STYLES[modeLower];

  return (
    <div
      className={`
                relative p-4 border-l-[3px] transition-all duration-200
                ${isSelected
          ? "bg-indigo-50/70 border-l-indigo-500"
          : `border-l-transparent ${isHover ? "hover:bg-slate-50" : ""}`
        }
                ${border ? "border-b border-slate-100" : ""}
            `}
    >
      <div className="flex items-start gap-3">
        {/* Company logo */}
        <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 bg-white flex-shrink-0">
          <Image
            src={job.company?.companyImage || noImage}
            alt={job.company?.companyName ?? "Company"}
            width={44}
            height={44}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold leading-snug truncate capitalize ${isSelected ? "text-indigo-900" : "text-slate-800"}`}>
            {job.jobTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {job.company?.companyName}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            {(job.city || job.state) && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <MapPin className="w-2.5 h-2.5" strokeWidth={2} />
                {[job.city, job.state].filter(Boolean).join(", ")}
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-2.5 h-2.5" strokeWidth={2} />
              {moment(job.createdAt).fromNow()}
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {modeBadge && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${modeBadge}`}>
                {job.mode}
              </span>
            )}
            {job.type && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-500 border-slate-200 capitalize">
                {job.type}
              </span>
            )}
            {(job.jobApplications?.length ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                <Users className="w-2.5 h-2.5" strokeWidth={2} />
                {job.jobApplications?.length} applied
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;