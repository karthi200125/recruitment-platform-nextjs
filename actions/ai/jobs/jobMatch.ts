import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export interface AIJobMatchResult {
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    experienceMatch: boolean;
    summary: string;
}

export async function analyzeJobMatch({
    user,
    job,
}: {
    user: {
        role?: string | null;
        profession?: string | null;
        skills?: string[];
        city?: string | null;
        state?: string | null;
        country?: string | null;

        educations?: {
            instituteName: string;
            degree: string;
            fieldOfStudy: string;
            startDate: string;
            endDate: string;
            percentage: string;
        }[];

        experiences?: {
            companyName: string;
            position: string;
            startDate: string;
            endDate: string;
            description: string | null;
        }[];

        projects?: {
            proName: string;
            proDesc: string;
            proLink: string;
        }[];
    };

    job: {
        jobTitle: string;
        jobDesc: string;
        experience: string;
        city: string;
        state: string;
        country: string;
        type: string;
        mode: string;
        skills: string[];
    };
}): Promise<AIJobMatchResult> {
    const prompt = `
You are Jobify's AI job matching engine.

Determine how suitable the user is for this job.

IMPORTANT:
- Do not invent skills, experience, education, or projects.
- Only use information provided below.
- A missing skill should only be reported if it is actually required by the job.
- Consider semantic similarity between related technologies.
- Consider the user's actual experience and projects.
- Consider the required experience level.
- Consider location/work mode when relevant.
- Return ONLY valid JSON.

USER:

Role:
${user.role ?? "Not provided"}

Profession:
${user.profession ?? "Not provided"}

Skills:
${user.skills?.join(", ") || "None"}

Location:
${[user.city, user.state, user.country].filter(Boolean).join(", ") || "Not provided"}

Education:
${user.educations?.length
            ? user.educations
                .map(
                    (education) =>
                        `${education.degree} in ${education.fieldOfStudy} at ${education.instituteName} (${education.startDate} - ${education.endDate})`
                )
                .join("\n")
            : "None"
        }

Experience:
${user.experiences?.length
            ? user.experiences
                .map(
                    (experience) =>
                        `${experience.position} at ${experience.companyName} (${experience.startDate} - ${experience.endDate})\n${experience.description ?? ""}`
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

JOB:

Title:
${job.jobTitle}

Description:
${job.jobDesc}

Required Experience:
${job.experience}

Required Skills:
${job.skills.join(", ") || "None"}

Location:
${[job.city, job.state, job.country].filter(Boolean).join(", ")}

Job Type:
${job.type}

Work Mode:
${job.mode}

Return exactly:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "experienceMatch": false,
  "summary": ""
}

Rules:
- matchScore must be an integer from 0 to 100.
- matchedSkills must contain skills/requirements the user clearly satisfies.
- missingSkills must contain important skills required by the job that the user does not clearly demonstrate.
- experienceMatch must reflect whether the user's experience appears to satisfy the job requirement.
- summary must be one concise sentence.
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

    const result = JSON.parse(cleaned) as AIJobMatchResult;

    return result;
}