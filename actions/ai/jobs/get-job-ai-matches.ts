"use server";

import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-3.6-flash";

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

const MAX_JOB_DESCRIPTION_LENGTH = 1200;

const MAX_JOBS_PER_AI_REQUEST = 10;

const MAX_SKILLS_PER_JOB = 30;

const MAX_PROFILE_SKILLS = 50;

const MAX_EXPERIENCES = 10;

const MAX_PROJECTS = 10;

const MAX_EDUCATIONS = 10;

function clampScore(value: unknown): number {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(number)
        )
    );
}

function normalizeString(value: unknown): string {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

function normalizeStringArray(
    value: unknown
): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (item): item is string =>
                typeof item === "string"
        )
        .map((item) => item.trim())
        .filter(Boolean);
}

function normalizeBoolean(
    value: unknown
): boolean {
    return value === true;
}

function normalizeSkill(
    skill: string
): string {
    return skill
        .toLowerCase()
        .trim()
        .replace(/[.#/+_-]/g, " ")
        .replace(/\s+/g, " ");
}

// ─────────────────────────────────────────────────────────────────────────────
// Skill matching
// ─────────────────────────────────────────────────────────────────────────────

function skillsMatch(
    userSkill: string,
    jobSkill: string
): boolean {
    const user = normalizeSkill(userSkill);
    const job = normalizeSkill(jobSkill);

    if (!user || !job) {
        return false;
    }

    if (user === job) {
        return true;
    }

    // Common technology aliases.
    const aliases: Record<string, string[]> = {
        javascript: [
            "js",
            "ecmascript",
        ],

        typescript: [
            "ts",
        ],

        react: [
            "reactjs",
            "react js",
        ],

        nextjs: [
            "next",
            "next js",
            "next.js",
        ],

        nodejs: [
            "node",
            "node js",
            "node.js",
        ],

        express: [
            "expressjs",
            "express js",
        ],

        postgres: [
            "postgresql",
            "postgre sql",
        ],

        mongodb: [
            "mongo",
        ],

        mysql: [
            "my sql",
        ],

        aws: [
            "amazon web services",
        ],

        docker: [
            "docker container",
        ],

        tailwindcss: [
            "tailwind",
            "tailwind css",
        ],

        github: [
            "git hub",
        ],

        git: [
            "github",
        ],
    };

    for (const [
        canonical,
        variations,
    ] of Object.entries(aliases)) {
        const userMatches =
            user === canonical ||
            variations.includes(user);

        const jobMatches =
            job === canonical ||
            variations.includes(job);

        if (
            userMatches &&
            jobMatches
        ) {
            return true;
        }
    }

    return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic fallback
// ─────────────────────────────────────────────────────────────────────────────
//
// This is NOT AI.
//
// It guarantees that a Gemini quota/network/model failure does not break
// the Jobs page.
//
// The user will still receive a useful compatibility score.
// ─────────────────────────────────────────────────────────────────────────────

function computeFallbackMatch(
    user: AIUserProfile,
    job: AIJob
): Omit<AIJobMatchResult, "jobId"> {
    const matchedSkills: string[] = [];

    for (const jobSkill of job.skills) {
        const matched = user.skills.some(
            (userSkill) =>
                skillsMatch(
                    userSkill,
                    jobSkill
                )
        );

        if (matched) {
            matchedSkills.push(jobSkill);
        }
    }

    const missingSkills =
        job.skills.filter(
            (jobSkill) =>
                !matchedSkills.includes(
                    jobSkill
                )
        );

    const skillsScore =
        job.skills.length > 0
            ? clampScore(
                (matchedSkills.length /
                    job.skills.length) *
                100
            )
            : 60;

    // ────────────────────────────────────────────────────────────────────────
    // Profession signal
    // ────────────────────────────────────────────────────────────────────────

    const userProfession =
        user.profession
            ?.toLowerCase()
            .trim() ?? "";

    const jobTitle =
        job.jobTitle
            .toLowerCase()
            .trim();

    const professionMatch =
        userProfession.length > 0 &&
        (
            jobTitle.includes(
                userProfession
            ) ||
            userProfession
                .split(/\s+/)
                .some(
                    (word) =>
                        word.length >= 4 &&
                        jobTitle.includes(word)
                )
        );

    const requirementsScore =
        professionMatch
            ? 85
            : 55;

    // ────────────────────────────────────────────────────────────────────────
    // Experience signal
    // ────────────────────────────────────────────────────────────────────────

    const experienceScore =
        user.experiences.length > 0
            ? 70
            : 35;

    const experienceMatch =
        user.experiences.length > 0;

    // ────────────────────────────────────────────────────────────────────────
    // Location signal
    // ────────────────────────────────────────────────────────────────────────

    const userCity =
        user.city
            ?.toLowerCase()
            .trim();

    const userState =
        user.state
            ?.toLowerCase()
            .trim();

    const jobCity =
        job.city
            ?.toLowerCase()
            .trim();

    const jobState =
        job.state
            ?.toLowerCase()
            .trim();

    const isRemote =
        job.mode
            ?.toLowerCase()
            .includes("remote");

    const sameCity =
        !!userCity &&
        !!jobCity &&
        userCity === jobCity;

    const sameState =
        !!userState &&
        !!jobState &&
        userState === jobState;

    const locationScore =
        isRemote
            ? 100
            : sameCity
                ? 100
                : sameState
                    ? 85
                    : 50;

    // ────────────────────────────────────────────────────────────────────────
    // Job type
    // ────────────────────────────────────────────────────────────────────────

    // The current profile shape does not contain a reliable job-type
    // preference, so keep this neutral instead of inventing compatibility.
    const jobTypeScore = 60;

    // ────────────────────────────────────────────────────────────────────────
    // Overall score
    // ────────────────────────────────────────────────────────────────────────

    const matchScore = clampScore(
        skillsScore * 0.45 +
        experienceScore * 0.20 +
        requirementsScore * 0.15 +
        locationScore * 0.10 +
        jobTypeScore * 0.10
    );

    const skillText =
        matchedSkills
            .slice(0, 3)
            .join(", ");

    const summary =
        skillText
            ? `Your profile matches ${skillText}, giving this job a ${matchScore}% compatibility score.`
            : `Your profile has limited demonstrated overlap with this job, giving it a ${matchScore}% compatibility score.`;

    return {
        matchScore,

        matchedSkills,

        missingSkills,

        experienceMatch,

        skillsScore,

        experienceScore,

        requirementsScore,

        locationScore,

        jobTypeScore,

        summary,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sanitize input before sending to Gemini
// ─────────────────────────────────────────────────────────────────────────────

function sanitizeUser(
    user: AIUserProfile
): AIUserProfile {
    return {
        profession:
            normalizeString(user.profession) ||
            null,

        skills:
            user.skills
                .slice(0, MAX_PROFILE_SKILLS)
                .map(normalizeString)
                .filter(Boolean),

        city:
            normalizeString(user.city) ||
            null,

        state:
            normalizeString(user.state) ||
            null,

        country:
            normalizeString(user.country) ||
            null,

        educations:
            user.educations
                .slice(0, MAX_EDUCATIONS)
                .map((education) => ({
                    instituteName:
                        normalizeString(
                            education.instituteName
                        ),

                    degree:
                        normalizeString(
                            education.degree
                        ),

                    fieldOfStudy:
                        normalizeString(
                            education.fieldOfStudy
                        ),
                })),

        experiences:
            user.experiences
                .slice(0, MAX_EXPERIENCES)
                .map((experience) => ({
                    companyName:
                        normalizeString(
                            experience.companyName
                        ),

                    position:
                        normalizeString(
                            experience.position
                        ),

                    description:
                        experience.description
                            ? normalizeString(
                                experience.description
                            ).slice(
                                0,
                                800
                            )
                            : null,
                })),

        projects:
            user.projects
                .slice(0, MAX_PROJECTS)
                .map((project) => ({
                    proName:
                        normalizeString(
                            project.proName
                        ),

                    proDesc:
                        normalizeString(
                            project.proDesc
                        ).slice(
                            0,
                            800
                        ),
                })),
    };
}

function sanitizeJobs(
    jobs: AIJob[]
): AIJob[] {
    return jobs
        .slice(0, MAX_JOBS_PER_AI_REQUEST)
        .map((job) => ({
            id: job.id,

            jobTitle:
                normalizeString(
                    job.jobTitle
                ),

            jobDesc:
                normalizeString(
                    job.jobDesc
                ).slice(
                    0,
                    MAX_JOB_DESCRIPTION_LENGTH
                ),

            experience:
                normalizeString(
                    job.experience
                ),

            city:
                normalizeString(
                    job.city
                ),

            state:
                normalizeString(
                    job.state
                ),

            country:
                normalizeString(
                    job.country
                ),

            type:
                normalizeString(
                    job.type
                ),

            mode:
                normalizeString(
                    job.mode
                ),

            skills:
                job.skills
                    .slice(
                        0,
                        MAX_SKILLS_PER_JOB
                    )
                    .map(normalizeString)
                    .filter(Boolean),
        }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Build prompt
// ─────────────────────────────────────────────────────────────────────────────

function buildPrompt(
    user: AIUserProfile,
    jobs: AIJob[]
): string {
    const jobsText = jobs
        .map(
            (job) => `
JOB ID: ${job.id}

TITLE:
${job.jobTitle}

DESCRIPTION:
${job.jobDesc || "Not provided"}

REQUIRED EXPERIENCE:
${job.experience || "Not specified"}

REQUIRED SKILLS:
${job.skills.join(", ") || "None"}

LOCATION:
${[
                    job.city,
                    job.state,
                    job.country,
                ]
                    .filter(Boolean)
                    .join(", ") || "Not specified"}

JOB TYPE:
${job.type || "Not specified"}

WORK MODE:
${job.mode || "Not specified"}
`
        )
        .join(
            "\n-----------------------------\n"
        );

    return `
You are Jobify's AI job matching engine.

Evaluate ONE candidate against EVERY provided job.

Your job is to estimate genuine compatibility based ONLY on the evidence supplied.

Accuracy is more important than being generous.

══════════════════════════════════════
CANDIDATE
══════════════════════════════════════

Profession:
${user.profession ?? "Not provided"}

Skills:
${user.skills.join(", ") || "None"}

Location:
${[
            user.city,
            user.state,
            user.country,
        ]
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
                        `${experience.position} at ${experience.companyName}\nDescription: ${experience.description ?? "None"}`
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

══════════════════════════════════════
JOBS
══════════════════════════════════════

${jobsText}

══════════════════════════════════════
MATCHING RULES
══════════════════════════════════════

Evaluate every job independently.

Consider:

1. Direct technical skill matches.
2. Closely related technologies.
3. Semantic similarity between technologies.
4. Actual demonstrated experience.
5. Required experience level.
6. Important job requirements.
7. Candidate profession.
8. Projects that demonstrate relevant abilities.
9. Relevant education.
10. Location compatibility.
11. Remote/work-mode compatibility.
12. Job-type compatibility.

══════════════════════════════════════
STRICT ACCURACY RULES
══════════════════════════════════════

- NEVER invent candidate skills.
- NEVER invent candidate experience.
- NEVER invent candidate projects.
- NEVER invent candidate education.
- NEVER assume a candidate knows a technology merely because they know a related technology.
- Related technologies may be considered compatible only when there is a reasonable technical relationship.
- matchedSkills must contain only skills clearly supported by the candidate profile.
- missingSkills should contain only important job skills that the candidate does not clearly demonstrate.
- Do not treat every word in a job description as a required skill.
- Distinguish required skills from optional or nice-to-have skills.
- Do not give a high score simply because the job title is similar.
- Projects may support a skill match when the project description provides evidence.
- experienceMatch is true only when demonstrated experience reasonably satisfies the stated requirement.
- For remote jobs, locationScore should generally be high unless the job explicitly restricts geography.
- For location-sensitive jobs, compare the candidate's location with the job location.
- Job type compatibility should only be scored highly when supported by available evidence.
- Scores must reflect evidence, not optimism.

══════════════════════════════════════
SCORING
══════════════════════════════════════

skillsScore:
How strongly the candidate's demonstrated skills match the important required skills.

experienceScore:
How strongly the candidate's actual experience matches the required experience.

requirementsScore:
How strongly the candidate satisfies the important requirements of the role overall.

locationScore:
How compatible the candidate's location is with the job location and work mode.

jobTypeScore:
How compatible the candidate appears to be with the job type/work arrangement based on available information.

matchScore:
Overall suitability.

Use this approximate weighting:

skillsScore: 45%
experienceScore: 20%
requirementsScore: 15%
locationScore: 10%
jobTypeScore: 10%

Do not blindly calculate the score if doing so contradicts the actual evidence.

══════════════════════════════════════
OUTPUT REQUIREMENTS
══════════════════════════════════════

- Return EXACTLY one result for every provided job.
- Preserve every provided JOB ID.
- jobId MUST correspond to an actual provided JOB ID.
- Never create a job ID.
- All score fields must be integers from 0 to 100.
- matchedSkills must be an array of strings.
- missingSkills must be an array of strings.
- experienceMatch must be boolean.
- summary must be one concise sentence.
- Return ONLY a JSON array.
- Do NOT return markdown.
- Do NOT return explanations outside the JSON.
- Do NOT omit any job.

Return exactly this shape:

[
  {
    "jobId": 123,
    "matchScore": 0,
    "matchedSkills": [],
    "missingSkills": [],
    "experienceMatch": false,
    "skillsScore": 0,
    "experienceScore": 0,
    "requirementsScore": 0,
    "locationScore": 0,
    "jobTypeScore": 0,
    "summary": ""
  }
]
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Parse Gemini JSON safely
// ─────────────────────────────────────────────────────────────────────────────

function parseGeminiResponse(
    text: string,
    jobs: AIJob[]
): AIJobMatchResult[] {
    let cleaned = text.trim();

    // Remove markdown fences if the model adds them.
    cleaned = cleaned
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    const parsed: unknown =
        JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
        throw new Error(
            "Gemini response was not an array"
        );
    }

    const validJobIds = new Set(
        jobs.map((job) => job.id)
    );

    const results: AIJobMatchResult[] = [];

    for (const item of parsed) {
        if (
            !item ||
            typeof item !== "object"
        ) {
            continue;
        }

        const raw =
            item as Record<
                string,
                unknown
            >;

        const jobId =
            Number(raw.jobId);

        if (!Number.isInteger(jobId)) {
            continue;
        }

        if (!validJobIds.has(jobId)) {
            continue;
        }

        const result: AIJobMatchResult = {
            jobId,

            matchScore:
                clampScore(
                    raw.matchScore
                ),

            matchedSkills:
                normalizeStringArray(
                    raw.matchedSkills
                ),

            missingSkills:
                normalizeStringArray(
                    raw.missingSkills
                ),

            experienceMatch:
                normalizeBoolean(
                    raw.experienceMatch
                ),

            skillsScore:
                clampScore(
                    raw.skillsScore
                ),

            experienceScore:
                clampScore(
                    raw.experienceScore
                ),

            requirementsScore:
                clampScore(
                    raw.requirementsScore
                ),

            locationScore:
                clampScore(
                    raw.locationScore
                ),

            jobTypeScore:
                clampScore(
                    raw.jobTypeScore
                ),

            summary:
                normalizeString(
                    raw.summary
                ),
        };

        results.push(result);
    }

    // Every job MUST have exactly one result.
    if (results.length !== jobs.length) {
        throw new Error(
            `Gemini returned ${results.length} matches for ${jobs.length} jobs`
        );
    }

    // Also verify there are no duplicate IDs.
    const uniqueIds = new Set(
        results.map(
            (result) => result.jobId
        )
    );

    if (uniqueIds.size !== jobs.length) {
        throw new Error(
            "Gemini returned duplicate job IDs"
        );
    }

    return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main function
// ─────────────────────────────────────────────────────────────────────────────

export async function getJobAIMatches(
    user: AIUserProfile,
    jobs: AIJob[]
): Promise<AIJobMatchResult[]> {
    if (!jobs.length) {
        return [];
    }

    // Safety: never send more than the intended batch size.
    const safeUser =
        sanitizeUser(user);

    const safeJobs =
        sanitizeJobs(jobs);

    if (!safeJobs.length) {
        return [];
    }

    // If Gemini isn't configured, gracefully use the local matcher.
    if (!process.env.GEMINI_API_KEY) {
        console.error(
            "❌ GEMINI_API_KEY is not configured"
        );

        return safeJobs.map((job) => ({
            jobId: job.id,

            ...computeFallbackMatch(
                safeUser,
                job
            ),
        }));
    }

    const prompt =
        buildPrompt(
            safeUser,
            safeJobs
        );

    try {
        const response =
            await ai.models.generateContent({
                model: GEMINI_MODEL,

                contents: prompt,

                config: {
                    responseMimeType:
                        "application/json",

                    temperature: 0.1,

                    maxOutputTokens: 4096,
                },
            });

        const text =
            response.text?.trim();

        if (!text) {
            throw new Error(
                "Gemini returned an empty response"
            );
        }

        return parseGeminiResponse(
            text,
            safeJobs
        );
    } catch (error: unknown) {
        const err =
            error as {
                status?: number;
                statusCode?: number;
                message?: string;
            };

        const status =
            err?.status ??
            err?.statusCode;

        if (
            status === 429 ||
            status === 403
        ) {
            console.warn(
                `⚠️ Gemini unavailable (${status}). Using deterministic fallback.`
            );
        } else {
            console.error(
                "❌ getJobAIMatches failed:",
                err?.message ?? error
            );
        }

        // NEVER allow AI failure to break the Jobs page.
        return safeJobs.map((job) => ({
            jobId: job.id,

            ...computeFallbackMatch(
                safeUser,
                job
            ),
        }));
    }
}