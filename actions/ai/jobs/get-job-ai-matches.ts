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

/*
|--------------------------------------------------------------------------
| AI request limits
|--------------------------------------------------------------------------
|
| These limits protect:
| - Gemini latency
| - token usage
| - Vercel execution time
| - request size
|
*/

const MAX_JOBS_PER_AI_REQUEST = 5;

const MAX_JOB_DESCRIPTION_LENGTH = 900;

const MAX_SKILLS_PER_JOB = 20;

const MAX_PROFILE_SKILLS = 30;

const MAX_EXPERIENCES = 5;

const MAX_PROJECTS = 5;

const MAX_EDUCATIONS = 5;

const MAX_EXPERIENCE_DESCRIPTION_LENGTH = 400;

const MAX_PROJECT_DESCRIPTION_LENGTH = 400;


/*
|--------------------------------------------------------------------------
| Normalization helpers
|--------------------------------------------------------------------------
*/

function normalizeString(value: unknown): string {
    return typeof value === "string"
        ? value.trim()
        : "";
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


/*
|--------------------------------------------------------------------------
| Skill normalization
|--------------------------------------------------------------------------
*/

function normalizeSkill(
    skill: string
): string {
    return skill
        .toLowerCase()
        .trim()
        .replace(/[.#/+_-]/g, " ")
        .replace(/\s+/g, " ");
}


/*
|--------------------------------------------------------------------------
| Skill aliases
|--------------------------------------------------------------------------
*/

const SKILL_ALIASES: Record<string, string[]> = {
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
};


/*
|--------------------------------------------------------------------------
| Fast deterministic skill matching
|--------------------------------------------------------------------------
*/

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

    for (const [
        canonical,
        aliases,
    ] of Object.entries(SKILL_ALIASES)) {
        const userMatches =
            user === canonical ||
            aliases.includes(user);

        const jobMatches =
            job === canonical ||
            aliases.includes(job);

        if (userMatches && jobMatches) {
            return true;
        }
    }

    return false;
}


/*
|--------------------------------------------------------------------------
| Deterministic fallback
|--------------------------------------------------------------------------
|
| Used when Gemini is unavailable.
|
*/

function computeFallbackMatch(
    user: AIUserProfile,
    job: AIJob
): Omit<AIJobMatchResult, "jobId"> {
    const matchedSkills: string[] = [];

    for (const jobSkill of job.skills) {
        if (
            user.skills.some(
                (userSkill) =>
                    skillsMatch(
                        userSkill,
                        jobSkill
                    )
            )
        ) {
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

    const experienceScore =
        user.experiences.length > 0
            ? 70
            : 35;

    const experienceMatch =
        user.experiences.length > 0;

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
        Boolean(userCity) &&
        Boolean(jobCity) &&
        userCity === jobCity;

    const sameState =
        Boolean(userState) &&
        Boolean(jobState) &&
        userState === jobState;

    const locationScore =
        isRemote
            ? 100
            : sameCity
                ? 100
                : sameState
                    ? 85
                    : 50;

    const jobTypeScore = 60;

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


/*
|--------------------------------------------------------------------------
| Sanitize candidate profile
|--------------------------------------------------------------------------
*/

function sanitizeUser(
    user: AIUserProfile
): AIUserProfile {
    return {
        profession:
            normalizeString(
                user.profession
            ) || null,

        skills:
            normalizeStringArray(
                user.skills
            )
                .slice(0, MAX_PROFILE_SKILLS),

        city:
            normalizeString(
                user.city
            ) || null,

        state:
            normalizeString(
                user.state
            ) || null,

        country:
            normalizeString(
                user.country
            ) || null,

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
                                MAX_EXPERIENCE_DESCRIPTION_LENGTH
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
                            MAX_PROJECT_DESCRIPTION_LENGTH
                        ),
                })),
    };
}


/*
|--------------------------------------------------------------------------
| Sanitize jobs
|--------------------------------------------------------------------------
*/

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
                normalizeStringArray(
                    job.skills
                )
                    .slice(0, MAX_SKILLS_PER_JOB),
        }));
}


/*
|--------------------------------------------------------------------------
| Compact prompt builder
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Keep the prompt short.
| The model already understands how to perform matching.
|
*/

function buildPrompt(
    user: AIUserProfile,
    jobs: AIJob[]
): string {
    const candidate = {
        profession: user.profession,
        skills: user.skills,
        location: [
            user.city,
            user.state,
            user.country,
        ]
            .filter(Boolean)
            .join(", "),

        education:
            user.educations.map(
                (education) => ({
                    degree: education.degree,
                    field: education.fieldOfStudy,
                    institute: education.instituteName,
                })
            ),

        experience:
            user.experiences.map(
                (experience) => ({
                    position: experience.position,
                    company: experience.companyName,
                    description:
                        experience.description,
                })
            ),

        projects:
            user.projects.map(
                (project) => ({
                    name: project.proName,
                    description: project.proDesc,
                })
            ),
    };

    const jobData = jobs.map(
        (job) => ({
            id: job.id,
            title: job.jobTitle,
            description: job.jobDesc,
            experience: job.experience,
            skills: job.skills,
            location: [
                job.city,
                job.state,
                job.country,
            ]
                .filter(Boolean)
                .join(", "),
            type: job.type,
            mode: job.mode,
        })
    );

    return JSON.stringify({
        task:
            "Match the candidate against every job. Use only supplied evidence. Return one result per job.",

        rules: [
            "Never invent skills, experience, projects, or education.",
            "Do not assume related technologies are identical.",
            "matchedSkills must be supported by the candidate.",
            "missingSkills must contain important missing requirements.",
            "Evaluate experience against the stated requirement.",
            "Consider location and remote work.",
            "Consider job type.",
            "Scores must be integers from 0 to 100.",
            "Return exactly one result for every job.",
            "Return only the JSON array.",
        ],

        scoring: {
            skills: 45,
            experience: 20,
            requirements: 15,
            location: 10,
            jobType: 10,
        },

        candidate,

        jobs: jobData,

        output: {
            jobId: "number",
            matchScore: "number",
            matchedSkills: "string[]",
            missingSkills: "string[]",
            experienceMatch: "boolean",
            skillsScore: "number",
            experienceScore: "number",
            requirementsScore: "number",
            locationScore: "number",
            jobTypeScore: "number",
            summary: "one concise sentence",
        },
    });
}


/*
|--------------------------------------------------------------------------
| Parse Gemini response
|--------------------------------------------------------------------------
*/

function parseGeminiResponse(
    text: string,
    jobs: AIJob[]
): AIJobMatchResult[] {
    let cleaned = text.trim();

    if (
        cleaned.startsWith("```")
    ) {
        cleaned = cleaned
            .replace(
                /^```(?:json)?\s*/i,
                ""
            )
            .replace(
                /\s*```$/,
                ""
            )
            .trim();
    }

    const parsed: unknown =
        JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
        throw new Error(
            "Gemini response was not an array"
        );
    }

    const validJobIds =
        new Set(
            jobs.map(
                (job) => job.id
            )
        );

    const results: AIJobMatchResult[] = [];
    const seenJobIds =
        new Set<number>();

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

        if (
            !Number.isInteger(jobId) ||
            !validJobIds.has(jobId) ||
            seenJobIds.has(jobId)
        ) {
            continue;
        }

        seenJobIds.add(jobId);

        results.push({
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
        });
    }

    if (
        results.length !== jobs.length
    ) {
        throw new Error(
            `Gemini returned ${results.length} matches for ${jobs.length} jobs`
        );
    }

    return results;
}


/*
|--------------------------------------------------------------------------
| Main AI matching function
|--------------------------------------------------------------------------
*/

export async function getJobAIMatches(
    user: AIUserProfile,
    jobs: AIJob[]
): Promise<AIJobMatchResult[]> {
    if (
        !jobs.length
    ) {
        return [];
    }

    const safeUser =
        sanitizeUser(user);

    const safeJobs =
        sanitizeJobs(jobs);

    if (
        !safeJobs.length
    ) {
        return [];
    }

    /*
    |--------------------------------------------------------------------------
    | Local fallback
    |--------------------------------------------------------------------------
    */

    if (
        !process.env.GEMINI_API_KEY
    ) {
        console.error(
            "❌ GEMINI_API_KEY is not configured"
        );

        return safeJobs.map(
            (job) => ({
                jobId: job.id,
                ...computeFallbackMatch(
                    safeUser,
                    job
                ),
            })
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Build compact prompt
    |--------------------------------------------------------------------------
    */

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

                    /*
                    * Smaller output budget because
                    * summaries are intentionally concise.
                    */
                    maxOutputTokens: 2048,
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

        /*
        |--------------------------------------------------------------------------
        | Never break jobs page because AI failed.
        |--------------------------------------------------------------------------
        */

        return safeJobs.map(
            (job) => ({
                jobId: job.id,
                ...computeFallbackMatch(
                    safeUser,
                    job
                ),
            })
        );
    }
}