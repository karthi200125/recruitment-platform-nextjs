"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

interface ImproveUserAboutInput {
    about: string;
    profession?: string;
    userBio?: string;
    skills?: string[];
}

interface ImproveUserAboutResult {
    success?: string;
    error?: string;
    suggestion?: string;
}

export async function improveUserAbout(
    input: ImproveUserAboutInput
): Promise<ImproveUserAboutResult> {
    try {
        /*
         * ---------------------------------------------------------
         * Normalize input
         * ---------------------------------------------------------
         */

        const about =
            input.about?.trim() ?? "";

        const profession =
            input.profession?.trim() ?? "";

        const userBio =
            input.userBio?.trim() ?? "";

        const skills =
            Array.isArray(input.skills)
                ? input.skills
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                : [];


        /*
         * ---------------------------------------------------------
         * Build prompt
         *
         * Works for:
         * - Candidate
         * - Recruiter
         * - Organization
         *
         * We intentionally don't use role-specific wording.
         * ---------------------------------------------------------
         */

        const prompt = `
You are Jobidy's professional profile writing assistant.

Your task is to CREATE or IMPROVE the user's About section
for a professional job and career platform.

CURRENT ABOUT:
${about || "EMPTY — create a new About section."}

PROFESSION:
${profession || "Not provided"}

PROFESSIONAL HEADLINE:
${userBio || "Not provided"}

SKILLS:
${skills.length > 0 ? skills.join(", ") : "Not provided"}

INSTRUCTIONS:

1. If the current About section is empty:
   - Create a new professional About section using only
     the information provided.

2. If the current About section exists:
   - Improve its grammar, clarity, structure, and
     professional quality.
   - Preserve the user's original meaning.

3. Use ONLY information provided.

4. NEVER invent:
   - Skills
   - Technologies
   - Companies
   - Job positions
   - Work experience
   - Years of experience
   - Education
   - Certifications
   - Achievements
   - Projects
   - Responsibilities
   - Numbers or statistics

5. Do not make unsupported claims.

6. Do NOT write one large paragraph.

7. Structure the About section as 3–5 concise bullet points.

8. Each bullet should communicate a useful professional
   detail such as:
   - Professional identity
   - Core technical skills
   - Relevant experience
   - Areas of expertise
   - Professional interests

9. Keep each bullet concise and easy to scan.

10. Highlight important professional keywords using Markdown
    bold syntax.

    Example:
    **React**, **Next.js**, **TypeScript**, **Node.js**

11. Only bold genuinely important keywords.
    Do not bold entire sentences.

12. Keep the total length approximately 60–120 words.

13. Keep the writing natural and human.

14. Avoid generic AI buzzwords such as:
    "passionate", "dynamic", "results-driven",
    "highly motivated", etc., unless supported by the
    user's actual information.

15. Write in first person when appropriate.

16. Do not use emojis.

17. Do not add a heading such as "About Me".

18. Return ONLY the bullet points.

19. Use this exact bullet format:

- **Important keyword** followed by the description.
- Another professional point.
- Another professional point.

Do not explain your reasoning.
Do not explain what you changed.
`;


        /*
         * ---------------------------------------------------------
         * Gemini request
         * ---------------------------------------------------------
         */

        const response =
            await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: prompt,
            });


        /*
         * ---------------------------------------------------------
         * Get generated text safely
         * ---------------------------------------------------------
         */

        const suggestion =
            response.text?.trim();


        if (!suggestion) {
            return {
                error:
                    "AI returned an empty suggestion. Please try again.",
            };
        }


        /*
         * ---------------------------------------------------------
         * Return suggestion
         * ---------------------------------------------------------
         */

        return {
            success:
                "About suggestion generated successfully.",

            suggestion,
        };

    } catch (error) {

        console.error(
            "❌ improveUserAbout error:",
            error
        );

        return {
            error:
                "Unable to generate an AI suggestion right now. Please try again.",
        };
    }
}