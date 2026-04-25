'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { FileText } from 'lucide-react';
import JobDescriptionSkeleton from '@/Skeletons/JobDescriptionSkeleton';

interface Job {
    jobDesc?: string | null;
}

interface JobDescriptionProps {
    job: Job;
    isPending?: boolean;
}

const JobDescription = ({ job, isPending }: JobDescriptionProps) => {
    const [sanitizedDesc, setSanitizedDesc] = useState('');

    useEffect(() => {
        if (job?.jobDesc) {
            setSanitizedDesc(DOMPurify.sanitize(job.jobDesc));
        }
    }, [job]);

    if (isPending) return <JobDescriptionSkeleton />;

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                <h3 className="text-sm font-bold text-slate-800">About the Job</h3>
            </div>

            {sanitizedDesc ? (
                <div
                    className="
                        prose prose-sm max-w-none text-slate-600
                        prose-headings:text-slate-800 prose-headings:font-semibold
                        prose-p:leading-relaxed prose-p:text-slate-600
                        prose-li:text-slate-600 prose-li:leading-relaxed
                        prose-strong:text-slate-800 prose-strong:font-semibold
                        prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                        prose-ul:space-y-1 prose-ol:space-y-1
                    "
                    dangerouslySetInnerHTML={{ __html: sanitizedDesc }}
                />
            ) : (
                <p className="text-sm text-slate-400 italic">No description provided for this job.</p>
            )}
        </div>
    );
};

export default JobDescription;