import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EmployerJobClient from "../EmployerJobClient";

interface Props {
    params: {
        jobId: string;
    };
    searchParams: {
        applicantId?: string;
    };
}

export default async function EmployerJobPage({ params, searchParams }: Props) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/signin");
    }

    const userId = Number(session.user.id);
    const jobId = Number(params.jobId);

    const job = await db.job.findFirst({
        where: { id: jobId, userId },
        include: {
            company: true,
            jobApplications: {
                include: { user: true },
                orderBy: { createdAt: "desc" },
            },
            _count: {
                select: { jobApplications: true },
            },
        },
    });

    if (!job) {
        redirect("/dashboard/employer/jobs");
    }

    const selectedApplicantId = searchParams.applicantId
        ? Number(searchParams.applicantId)
        : job.jobApplications[0]?.id;

    const selectedApplication =
        job.jobApplications.find((app) => app.id === selectedApplicantId) ?? null;

    return (
        <EmployerJobClient
            job={job}
            applicants={job.jobApplications}
            selectedApplication={selectedApplication}
        />
    );
}