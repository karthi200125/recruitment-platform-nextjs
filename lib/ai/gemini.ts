import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateAIResponse(prompt: string) {
  const interaction = await ai.interactions.create({
    model: "gemini-2.5-flash",
    input: prompt,
  });

  return interaction.output_text;
}