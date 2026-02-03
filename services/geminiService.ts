
import { GoogleGenAI, Type } from "@google/genai";

export async function analyzeNumberPattern(phoneNumber: string) {
  if (!phoneNumber || phoneNumber.length < 5) return null;

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key missing, skipping AI analysis");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this phone number pattern: "${phoneNumber}". Based on common spam patterns (excessive repeating digits, specific area codes, sequential numbers), estimate if it's high risk. Return a brief risk label and score (0-100). Use "Spam" for high risk and "Unknown" for low risk.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLabel: { type: Type.STRING, description: 'Short label. MUST use "Spam" for risky numbers.' },
            riskScore: { type: Type.NUMBER, description: 'Numeric score from 0 (Safe) to 100 (Spam)' },
            explanation: { type: Type.STRING }
          },
          required: ["riskLabel", "riskScore"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return null;
  }
}
