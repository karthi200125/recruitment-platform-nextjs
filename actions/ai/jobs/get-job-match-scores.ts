"use server";

import { db } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export interface JobMatchScore {
    jobId: number;
    matchScore: number;
}

export async function getJobMatchScores(
    userId: number,
    jobs: {
        id: number;
        jobTitle: string;
        jobDesc: string;
        experience: string;
        city: string;
        state: string;
        country: string;
        type: string;
        mode: string;
        skills: string[];
    }[]
): Promise<JobMatchScore[]> {
    if (!jobs.length) {
        return [];
    }

    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            role: true,
            profession: true,
            skills: true,
            city: true,
            state: true,
            country: true,

            experiences: {
                select: {
                    position: true,
                    companyName: true,
                    description: true,
                },
            },

            projects: {
                select: {
                    proName: true,
                    proDesc: true,
                },
            },

            educations: {
                select: {
                    degree: true,
                    fieldOfStudy: true,
                    instituteName: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const jobsText = jobs
        .map(
            (job) => `
JOB ID: ${job.id}
TITLE: ${job.jobTitle}
DESCRIPTION: ${job.jobDesc}
REQUIRED EXPERIENCE: ${job.experience}
REQUIRED SKILLS: ${job.skills.join(", ")}
LOCATION: ${[job.city, job.state, job.country]
                    .filter(Boolean)
                    .join(", ")}
TYPE: ${job.type}
MODE: ${job.mode}
`
        )
        .join("\n-----------------------------\n");

    const prompt = `
You are Jobify's AI job matching engine.

Compare the user's profile against EVERY job below.

USER PROFILE:

Profession:
${user.profession ?? "Not provided"}

Skills:
${user.skills?.join(", ") || "None"}

Location:
${[user.city, user.state, user.country]
            .filter(Boolean)
            .join(", ") || "Not provided"}

Experience:
${user.experiences?.length
            ? user.experiences
                .map(
                    (experience) =>
                        `${experience.position} at ${experience.companyName}: ${experience.description ?? ""
                        }`
                )
                .join("\n")
            : "None"
        }

Projects:
${user.projects?.length
            ? user.projects
                .map(
                    (project) =>
                        `${project.proName}: ${project.proDesc}`
                )
                .join("\n")
            : "None"
        }

Education:
${user.educations?.length
            ? user.educations
                .map(
                    (education) =>
                        `${education.degree} in ${education.fieldOfStudy} at ${education.instituteName}`
                )
                .join("\n")
            : "None"
        }

JOBS:

${jobsText}

Return ONLY valid JSON.

Return exactly:

[
  {
    "jobId": 123,
    "matchScore": 92
  }
]

RULES:

- Return exactly one result for every JOB ID.
- jobId must be the actual JOB ID provided.
- matchScore must be an integer between 0 and 100.
- Consider skills, experience, projects, profession and requirements.
- Consider semantic similarity between related technologies.
- Do not invent user skills or experience.
- Do not use the job's position in the list to determine the score.
`;

    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
    });

    const text = interaction.output_text?.trim();

    if (!text) {
        throw new Error("Gemini returned an empty response");
    }

    const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    const result = JSON.parse(cleaned) as JobMatchScore[];

    return result.map((item) => ({
        jobId: Number(item.jobId),
        matchScore: Math.min(
            Math.max(Math.round(item.matchScore), 0),
            100
        ),
    }));
}