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

  const title = location
    ? `${query} jobs in ${location} | Find your next opportunity`
    : `${query} jobs | Find your next opportunity`;

  const description = location
    ? `Browse ${query} jobs in ${location}. Apply to top companies hiring now.`
    : `Browse ${query} jobs from top companies. Apply and grow your career.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/jobs`,
    },
    openGraph: {
      title,
      description,
      url: "/jobs",
      siteName: "YourJobPlatform",
      type: "website",
    },
  };
}


export default async function JobsPage({ searchParams }: JobsPageProps) {

  const session = await getServerSession(authOptions);

  const userId: number | undefined = session?.user?.id
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


  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.map((job, index) => ({
      "@type": "JobPosting",
      position: index + 1,
      title: job.jobTitle,
      hiringOrganization: {
        "@type": "Organization",
        name: job.company.companyName,
      },
      datePosted: job.createdAt,
    })),
  };

  return (
    <>
      {/* ✅ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* ✅ Client Component */}
      <JobsClient
        initialJobs={jobs}
        initialCount={count}
        searchParams={filters}
        currentPage={currentPage}
      />
    </>
  );
}