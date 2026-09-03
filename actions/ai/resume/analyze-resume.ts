"use server";

import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";
import type { ResumeAnalysisData } from "@/types/resume-analysis";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const resumeAnalysisSchema = {
    type: "object",
    properties: {
        overallScore: {
            type: "integer",
            description: "Overall resume score from 0 to 100.",
        },
        headline: {
            type: "string",
            description: "A short professional assessment of the resume.",
        },
        summary: {
            type: "string",
            description: "A concise 1 to 2 sentence assessment.",
        },
        metrics: {
            type: "object",
            properties: {
                atsCompatibility: {
                    type: "integer",
                    description: "ATS compatibility score from 0 to 100.",
                },
                workExperience: {
                    type: "integer",
                    description: "Work experience presentation score from 0 to 100.",
                },
                skills: {
                    type: "integer",
                    description: "Skills section quality score from 0 to 100.",
                },
                projects: {
                    type: "integer",
                    description: "Projects quality score from 0 to 100.",
                },
                structureAndClarity: {
                    type: "integer",
                    description: "Resume structure and clarity score from 0 to 100.",
                },
            },
            required: [
                "atsCompatibility",
                "workExperience",
                "skills",
                "projects",
                "structureAndClarity",
            ],
        },
        strengths: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                },
                required: ["title", "description"],
            },
        },
        areasToImprove: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                },
                required: ["title", "description"],
            },
        },
        suggestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    priority: {
                        type: "string",
                        enum: ["high", "medium", "low"],
                    },
                },
                required: ["title", "description", "priority"],
            },
        },
        skills: {
            type: "array",
            items: {
                type: "string",
            },
        },
        missingKeywords: {
            type: "array",
            items: {
                type: "string",
            },
        },
    },
    required: [
        "overallScore",
        "headline",
        "summary",
        "metrics",
        "strengths",
        "areasToImprove",
        "suggestions",
        "skills",
        "missingKeywords",
    ],
};

function clampScore(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

export async function analyzeResume(): Promise<{
    success: boolean;
    data?: ResumeAnalysisData;
    error?: string;
}> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                success: false,
                error: "Unauthorized.",
            };
        }

        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: {
                resume: true,
                resumePublicId: true,
            },
        });

        if (!user) {
            return {
                success: false,
                error: "User not found.",
            };
        }

        if (!user.resume || !user.resumePublicId) {
            return {
                success: false,
                error: "Please upload a resume before analyzing it.",
            };
        }

        const prompt = `
You are an expert technical recruiter, resume reviewer, and ATS specialist.

Analyze the attached resume carefully.

Your analysis MUST ONLY use information actually present in the resume.

Never invent:
- skills
- companies
- job titles
- experience
- years of experience
- education
- certifications
- achievements
- technologies
- projects

Evaluate the resume based on:

1. ATS compatibility
2. Work experience presentation
3. Skills quality and relevance
4. Projects
5. Structure and clarity
6. Professional presentation
7. Strengths
8. Areas that need improvement
9. Practical recommendations

Scoring:

90-100 = Excellent
80-89 = Very good
70-79 = Good
60-69 = Needs improvement
0-59 = Major improvement needed

Be specific and useful.

For weaknesses, explain what is wrong and how the candidate can improve it.

For suggestions, give practical actions the candidate can actually take.

For missingKeywords, only include keywords that are reasonably relevant based on the candidate's actual resume and apparent professional direction. Do not invent technologies or qualifications.

Return ONLY the requested JSON structure.
`;

        const resumeResponse = await fetch(user.resume);

        if (!resumeResponse.ok) {
            return {
                success: false,
                error: "Unable to access your uploaded resume.",
            };
        }

        const resumeBuffer = Buffer.from(await resumeResponse.arrayBuffer());

        const resumeBase64 = resumeBuffer.toString("base64");

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType: "application/pdf",
                                data: resumeBase64,
                            },
                        },
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: resumeAnalysisSchema,
            },
        });

        const outputText = response.text?.trim();        

        if (!outputText) {
            return {
                success: false,
                error: "AI returned an empty analysis.",
            };
        }

        let analysis: ResumeAnalysisData;

        try {
            analysis = JSON.parse(outputText) as ResumeAnalysisData;
        } catch (error) {
            console.error("[ANALYZE_RESUME] Invalid JSON:", error);

            return {
                success: false,
                error: "AI returned an invalid analysis.",
            };
        }

        analysis.overallScore = clampScore(analysis.overallScore);

        analysis.metrics.atsCompatibility = clampScore(
            analysis.metrics.atsCompatibility
        );

        analysis.metrics.workExperience = clampScore(
            analysis.metrics.workExperience
        );

        analysis.metrics.skills = clampScore(
            analysis.metrics.skills
        );

        analysis.metrics.projects = clampScore(
            analysis.metrics.projects
        );

        analysis.metrics.structureAndClarity = clampScore(
            analysis.metrics.structureAndClarity
        );

        return {
            success: true,
            data: analysis,
        };
    } catch (error) {
        console.error("[ANALYZE_RESUME]", error);

        return {
            success: false,
            error: "Something went wrong while analyzing your resume.",
        };
    }
}