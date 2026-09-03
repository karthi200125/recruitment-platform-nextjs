"use server";

import { generateAIResponse } from "@/lib/ai/gemini";

export async function testGemini() {
    const response = await generateAIResponse(
        "Explain what a job board is in one sentence."
    );

    return response;
}