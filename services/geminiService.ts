
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTeamNames = async (count: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} creative, professional, and fun team names for a corporate event. Provide the output as a simple JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    const text = response.text;
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Error generating team names:", error);
    // Fallback names
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
};

export const generateIceBreaker = async (groupMembers: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a fun ice-breaker question or a short 1-sentence group challenge for a team consisting of: ${groupMembers.join(', ')}. Keep it positive and work-appropriate.`,
    });
    return response.text;
  } catch (error) {
    return "Share a fun fact about yourself!";
  }
};
