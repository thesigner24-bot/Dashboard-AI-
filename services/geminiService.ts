import { GoogleGenAI } from "@google/genai";
import { Alert } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeAlerts = async (alerts: Alert[]): Promise<string> => {
  try {
    const alertSummary = alerts.map(a => 
      `- Time: ${a.timestamp}, Type: ${a.issueType}, Severity: ${a.status}, Details: ${a.message}`
    ).join('\n');

    const prompt = `
      You are an expert industrial data analyst for a coal processing plant.
      Analyze the following recent coal sizing alerts. 
      Identify patterns in the particle size deviations and suggest a brief operational adjustment.
      Keep the response concise (under 100 words) and professional.
      
      Alert Data:
      ${alertSummary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "Unable to generate analysis at this time. Please check your API key or connection.";
  }
};