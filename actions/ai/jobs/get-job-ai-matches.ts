import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export interface AIJobMatchResult {
    jobId: number;

    matchScore: number;

    matchedSkills: string[];

    missingSkills: string[];

    experienceMatch: boolean;

    skillsScore: number;

    experienceScore: number;

    requirementsScore: number;

    locationScore: number;

    jobTypeScore: number;

    summary: string;
}

interface AIUserProfile {
    profession: string | null;
    skills: string[];

    city: string | null;
    state: string | null;
    country: string | null;

    educations: {
        instituteName: string;
        degree: string;
        fieldOfStudy: string;
    }[];

    experiences: {
        companyName: string;
        position: string;
        description: string | null;
    }[];

    projects: {
        proName: string;
        proDesc: string;
    }[];
}

interface AIJob {
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
}

export async function getJobAIMatches(
    user: AIUserProfile,
    jobs: AIJob[]
): Promise<AIJobMatchResult[]> {
    if (!jobs.length) {
        return [];
    }

    const jobsText = jobs
        .map(
            (job) => `
JOB ID: ${job.id}

TITLE:
${job.jobTitle}

DESCRIPTION:
${job.jobDesc}

REQUIRED EXPERIENCE:
${job.experience}

REQUIRED SKILLS:
${job.skills.join(", ") || "None"}

LOCATION:
${[job.city, job.state, job.country]
                    .filter(Boolean)
                    .join(", ") || "Not specified"}

JOB TYPE:
${job.type}

WORK MODE:
${job.mode}
`
        )
        .join("\n-----------------------------\n");

    const prompt = `
You are Jobify's AI job matching engine.

Analyze the user's profile against every job provided below.

USER PROFILE

Profession:
${user.profession ?? "Not provided"}

Skills:
${user.skills.join(", ") || "None"}

Location:
${[user.city, user.state, user.country]
            .filter(Boolean)
            .join(", ") || "Not provided"}

Education:
${user.educations.length
            ? user.educations
                .map(
                    (education) =>
                        `${education.degree} in ${education.fieldOfStudy} at ${education.instituteName}`
                )
                .join("\n")
            : "None"
        }

Experience:
${user.experiences.length
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
${user.projects.length
            ? user.projects
                .map(
                    (project) =>
                        `${project.proName}: ${project.proDesc}`
                )
                .join("\n")
            : "None"
        }

JOBS

${jobsText}

Analyze every job.

Consider:

1. Technical skill compatibility.
2. Semantic similarity between related technologies.
3. Experience requirements.
4. Job requirements.
5. Candidate profession.
6. Projects that demonstrate relevant skills.
7. Education where relevant.
8. Location compatibility.
9. Job type compatibility.

IMPORTANT:

- Never invent candidate skills.
- Never invent candidate experience.
- Never assume the candidate has a skill that is not supported by their profile.
- Related technologies may be considered semantically compatible.
- Return exactly one result for every job.
- jobId MUST match the provided JOB ID.
- All scores must be integers from 0 to 100.
- Return ONLY valid JSON.

Return exactly this structure:

[
  {
    "jobId": 123,
    "matchScore": 92,
    "matchedSkills": ["React", "TypeScript"],
    "missingSkills": ["AWS"],
    "experienceMatch": true,
    "skillsScore": 95,
    "experienceScore": 85,
    "requirementsScore": 90,
    "locationScore": 100,
    "jobTypeScore": 100,
    "summary": "Strong match based on the candidate's technical skills and experience."
  }
]
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

    const parsed = JSON.parse(
        cleaned
    ) as AIJobMatchResult[];

    return parsed.map((result) => ({
        ...result,

        jobId: Number(result.jobId),

        matchScore: Math.min(
            Math.max(Math.round(result.matchScore), 0),
            100
        ),

        skillsScore: Math.min(
            Math.max(Math.round(result.skillsScore), 0),
            100
        ),

        experienceScore: Math.min(
            Math.max(Math.round(result.experienceScore), 0),
            100
        ),

        requirementsScore: Math.min(
            Math.max(Math.round(result.requirementsScore), 0),
            100
        ),

        locationScore: Math.min(
            Math.max(Math.round(result.locationScore), 0),
            100
        ),

        jobTypeScore: Math.min(
            Math.max(Math.round(result.jobTypeScore), 0),
            100
        ),
    }));
}