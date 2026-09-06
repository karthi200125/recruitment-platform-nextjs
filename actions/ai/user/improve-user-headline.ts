"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

interface ImproveUserHeadlineInput {
    userBio: string;
    profession?: string;
    skills?: string[];
    about?: string;
}

interface ImproveUserHeadlineResult {
    success?: string;
    error?: string;
    suggestion?: string;
}

export async function improveUserHeadline(
    input: ImproveUserHeadlineInput
): Promise<ImproveUserHeadlineResult> {
    try {
        const userBio = input.userBio?.trim() ?? "";
        const profession = input.profession?.trim() ?? "";
        const about = input.about?.trim() ?? "";

        const skills = Array.isArray(input.skills)
            ? input.skills
                .map((skill) => skill.trim())
                .filter(Boolean)
            : [];

        const prompt = `
You are Jobidy's professional profile writing assistant.

Create or improve a professional headline for the user's
profile on a job and career platform.

CURRENT HEADLINE:
${userBio || "EMPTY — create a new headline."}

PROFESSION:
${profession || "Not provided"}

SKILLS:
${skills.length > 0 ? skills.join(", ") : "Not provided"}

ABOUT:
${about || "Not provided"}

INSTRUCTIONS:

1. If the current headline is empty:
   - Create a new professional headline using the
     information provided.

2. If the current headline exists:
   - Improve it while preserving the user's actual
     professional identity.

3. Use ONLY information provided.

4. NEVER invent:
   - Skills
   - Technologies
   - Job titles
   - Companies
   - Experience
   - Years of experience
   - Certifications
   - Achievements
   - Education

5. Keep the headline concise and easy to scan.

6. The headline should clearly communicate the user's
   professional identity and relevant expertise.

7. Prioritize the profession and relevant skills.

8. Use separators such as "|" when useful.

9. Do not use emojis.

10. Avoid generic phrases such as:
    "passionate professional",
    "results-driven individual",
    "highly motivated",
    "dynamic professional",
    or similar empty buzzwords.

11. Do not make unsupported claims.

12. Keep the headline between approximately 40–100 characters
    whenever possible.

13. Return ONLY the headline.

14. Do not add quotation marks.

15. Do not add a heading.

16. Do not explain your reasoning.

17. Do not use Markdown.

EXAMPLE FORMAT:

Full Stack Developer | React | Next.js | TypeScript

Return only the final headline.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const suggestion = response.text?.trim();

        if (!suggestion) {
            return {
                error: "AI returned an empty headline. Please try again.",
            };
        }

        return {
            success: "Headline generated successfully.",
            suggestion,
        };
    } catch (error) {
        console.error("❌ improveUserHeadline error:", error);

        return {
            error: "Unable to generate an AI headline right now. Please try again.",
        };
    }
}