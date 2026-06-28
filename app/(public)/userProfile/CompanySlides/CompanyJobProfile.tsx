import { CompanyWithJobs } from "@/types";

import JobList from "../../jobs/JobLists/JobList";

interface CompanyJobProfileProps {
    company?: CompanyWithJobs | null;
}

const CompanyJobProfile = ({
    company,
}: CompanyJobProfileProps) => {
    const jobs = company?.jobs ?? [];

    return (
        <div className="grid grid-cols-1 gap-5 rounded-[10px] border p-2 md:grid-cols-2 md:p-5">
            {jobs.length === 0 && (
                <p className="text-sm text-neutral-500">
                    No Jobs yet!
                </p>
            )}

            {jobs.map((job) => (
                <div
                    key={job.id}
                    className="rounded-md border p-5"
                >
                    <JobList job={job} />
                </div>
            ))}
        </div>
    );
};

export default CompanyJobProfile;