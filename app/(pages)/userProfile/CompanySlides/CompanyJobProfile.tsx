"use client";

import { memo } from "react";
import JobList from "../../jobs/JobLists/JobList";

interface Company {
    jobs?: any[];
}

const CompanyJobProfile = ({
    company,
}: {
    company?: Company | null;
}) => {
    const jobs = company?.jobs ?? [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-2 md:p-5 border rounded-[10px]">

            {jobs.length === 0 && (
                <p className="text-neutral-500 text-sm">
                    No Jobs yet!
                </p>
            )}

            {jobs.map((job) => (
                <div key={job.id} className="border rounded-md p-5">
                    <JobList job={job} />
                </div>
            ))}
        </div>
    );
};

export default memo(CompanyJobProfile);