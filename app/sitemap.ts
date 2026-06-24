
import { getJobs } from '@/actions/job/get-jobs';
import { getAllUsers } from '@/actions/user/get-all-users';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_URL;

    const jobs = await getJobs();
    const users = await getAllUsers();

    const staticPages = [
        { url: `${baseUrl}/`, lastModified: new Date() },
        { url: `${baseUrl}/jobs`, lastModified: new Date() },
        { url: `${baseUrl}/companies`, lastModified: new Date() },
        { url: `${baseUrl}/createJob`, lastModified: new Date() },
        { url: `${baseUrl}/dashboard`, lastModified: new Date() },
        { url: `${baseUrl}/dashboard/employees`, lastModified: new Date() },
        { url: `${baseUrl}/dashboard/jobStatus`, lastModified: new Date() },
        { url: `${baseUrl}/messages`, lastModified: new Date() },
        { url: `${baseUrl}/network`, lastModified: new Date() },
        { url: `${baseUrl}/subscription`, lastModified: new Date() },
        { url: `${baseUrl}/welcome`, lastModified: new Date() },
    ];

    const jobPages = jobs
        .map((job: any) => ({
            url: `${baseUrl}/dashboard/jobCandidates/${job.id}`,
            lastModified: new Date(),
        }))
        .sort((a: any, b: any) => parseInt(a.url.split('/').pop()!) - parseInt(b.url.split('/').pop()!));

    const userPages = users
        .map((user: any) => ({
            url: `${baseUrl}/userProfile/${user.id}`,
            lastModified: new Date(),
        }))
        .sort((a: any, b: any) => parseInt(a.url.split('/').pop()!) - parseInt(b.url.split('/').pop()!));

    return [...staticPages, ...jobPages, ...userPages];
}
