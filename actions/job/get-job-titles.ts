import { db } from "@/lib/db";

export const getJobTitles = async (
  search: string
) => {
  try {
    if (!search.trim()) return [];

    return await db.job.findMany({
      where: {
        jobTitle: {
          contains: search,
          mode: 'insensitive',
        },
      },

      select: {
        jobTitle: true,
      },

      take: 10,
    });
  } catch (error) {
    console.error(
      'Failed to fetch job titles:',
      error
    );

    return [];
  }
};