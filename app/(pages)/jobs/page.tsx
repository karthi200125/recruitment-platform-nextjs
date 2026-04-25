import { Metadata } from "next";
import JobsClient from "./JobsClient";
import { getFilteredJobs } from "@/actions/job/getFilterAllJobs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

interface JobsPageProps {
  searchParams: Record<string, string | undefined>;
}

interface JobFilters {
  userId?: number;
  q?: string;
  location?: string;
  type?: string;
  experiencelevel?: string;
  dateposted?: string;
  easyApply?: string;
  company?: string;
  page: number;
}

export async function generateMetadata({
  searchParams,
}: JobsPageProps): Promise<Metadata> {
  const query = searchParams.q || "Jobs";
  const location = searchParams.location;

  return {
    title: location
      ? `${query} jobs in ${location}`
      : `${query} jobs`,
    description: "Find your next opportunity",
  };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id
    ? Number(session.user.id)
    : undefined;

  const currentPage = Math.max(1, Number(searchParams.page) || 1);

  const filters: JobFilters = {
    userId,
    q: searchParams.q?.trim() || undefined,
    location: searchParams.location || undefined,
    type: searchParams.type || undefined,
    experiencelevel: searchParams.experiencelevel || undefined,
    dateposted: searchParams.dateposted || undefined,
    easyApply: searchParams.easyApply || undefined,
    company: searchParams.company || undefined,
    page: currentPage,
  };

  const { jobs, count } = await getFilteredJobs(filters);

  return (
    <JobsClient
      initialJobs={jobs}
      initialCount={count}
      searchParams={filters}
      currentPage={currentPage}
    />
  );
}