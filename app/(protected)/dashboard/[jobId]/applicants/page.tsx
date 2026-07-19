import { AppliedWithinFilter, getJobApplicantsList, SortOption } from "@/actions/jobapplication/Getjobapplicantslist";
import { ApplicantsClient } from "./Applicantsclient";


interface JobApplicantsPageProps {
    params: { jobId: string };
    searchParams?: {
        applicantId?: string;
        search?: string;
        status?: string;
        appliedWithin?: string;
        sort?: string;
    };
}

export default async function JobApplicantsPage({ params, searchParams = {} }: JobApplicantsPageProps) {
    const jobId = Number(params.jobId);

    const { job, applicants, selected } = await getJobApplicantsList({
        jobId,
        applicantId: searchParams.applicantId ? Number(searchParams.applicantId) : undefined,
        search: searchParams.search,
        status: searchParams.status,
        appliedWithin: (searchParams.appliedWithin as AppliedWithinFilter) || null,
        sort: (searchParams.sort as SortOption) || "newest",
    });
    
    return (
        <ApplicantsClient applicants={applicants} selected={selected} jobSkills={job.skills} />
    );
}