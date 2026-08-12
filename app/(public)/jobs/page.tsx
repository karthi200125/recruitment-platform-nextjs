import { getFilteredJobs } from "@/actions/job/get-filter-all-jobs";
import { authOptions } from "@/lib/authentication/authOptions";
import { siteConfig } from "@/config";

import { Metadata } from "next";
import { getServerSession } from "next-auth";

import JobsClient from "./JobsClient";

export interface JobsPageProps {
  searchParams: {
    q?: string;
    location?: string;
    company?: string;
    type?: string;
    mode?: string;
    experiencelevel?: string;
    dateposted?: string;
    easyApply?: string;
    page?: string;
    jobId?: string;
  };
}

interface JobFilters {
  userId?: number;
  q?: string;
  location?: string;
  company?: string;
  type?: string;
  mode?: string;
  experiencelevel?: string;
  dateposted?: string;
  easyApply?: string;
  page: number;
}


export async function generateMetadata({
  searchParams,
}: JobsPageProps): Promise<Metadata> {
  const query = searchParams.q?.trim();
  const location = searchParams.location?.trim();
  const company = searchParams.company?.trim();
  const jobType = searchParams.type?.trim();
  const jobMode = searchParams.mode?.trim();
  const experience = searchParams.experiencelevel?.trim();

  let title = "Browse Jobs";

  let description =
    "Browse thousands of verified job opportunities, discover top companies, and apply for full-time, remote, and professional positions with Jobify.";

  if (query && location) {
    title = `${query} Jobs in ${location}`;

    description =
      `Explore the latest ${query} jobs in ${location}. ` +
      `Find verified employers, compare opportunities, and apply online with Jobify.`;
  } else if (query) {
    title = `${query} Jobs`;

    description =
      `Discover the latest ${query} job openings from verified companies. ` +
      `Apply online and grow your career with Jobify.`;
  } else if (company) {
    title = `${company} Jobs`;

    description =
      `Explore current job openings at ${company} ` +
      `and apply to verified career opportunities on Jobify.`;
  } else if (location) {
    title = `Jobs in ${location}`;

    description =
      `Browse verified job opportunities in ${location}. ` +
      `Find companies hiring near you and apply through Jobify.`;
  }

  return {
    title,
    description,

    keywords: [
      "Jobs",
      "Job Search",
      "Careers",
      "Hiring",
      "Employment",
      "Remote Jobs",
      "Software Engineer Jobs",
      "Developer Jobs",
      query,
      location,
      company,
      jobType,
      jobMode,
      experience,
    ].filter(Boolean) as string[],

    alternates: {
      canonical: "/jobs",
    },

    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: "/jobs",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.twitterImage],
    },
  };
}


export default async function JobsPage({
  searchParams,
}: JobsPageProps) {
  /*
   * Get authenticated user on the server.
   */
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id
    ? session.user.id
    : undefined;

  /*
   * Normalize page.
   */
  const currentPage = Math.max(
    1,
    Number(searchParams.page) || 1
  );

  const filters: JobFilters = {
    userId,

    q:
      searchParams.q?.trim() ||
      undefined,

    location:
      searchParams.location?.trim() ||
      undefined,

    company:
      searchParams.company?.trim() ||
      undefined,

    type:
      searchParams.type?.trim() ||
      undefined,

    mode:
      searchParams.mode?.trim() ||
      undefined,

    experiencelevel:
      searchParams.experiencelevel?.trim() ||
      undefined,

    dateposted:
      searchParams.dateposted?.trim() ||
      undefined,

    easyApply:
      searchParams.easyApply?.trim() ||
      undefined,

    page: currentPage,
  };


  const { jobs, count, } = await getFilteredJobs(filters);

  return (
    <JobsClient
      initialJobs={jobs}
      initialCount={count}
      searchParams={filters}
      currentPage={currentPage}
    />
  );
}