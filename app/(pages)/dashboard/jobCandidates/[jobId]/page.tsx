

import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { getJobUsingId } from "@/actions/job/getJobUsingId";
import { getApplicationCandidates } from "@/actions/jobapplication/getApplicationcandidates";
import JobCandidatesClient from "../JobCandidatesClient";


export const metadata: Metadata = {
    title: "Job Candidates",
    robots: {
        index: false,
        follow: false,
    },
};

interface PageProps {
    params: {
        jobId: string;
    };
}

const JobCandidatesPage = async ({ params }: PageProps) => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const jobId = Number(params.jobId);

    if (!jobId) {
        redirect("/dashboard");
    }


    const [job, candidates] = await Promise.all([
        getJobUsingId(jobId),
        getApplicationCandidates(jobId),
    ]);

    if (!job) {
        redirect("/dashboard");
    }

    return (
        <JobCandidatesClient
            job={job}
            candidates={candidates ?? []}
        />
    );
};

export default JobCandidatesPage;