
import { GoogleGenAI, Type } from "@google/genai";
import { GapAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeProcessGaps(userDescription: string): Promise<GapAnalysisResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following business process description and identify operational gaps, recommend one of our plans (Plan A, B, C, or D), and estimate ROI. 
    User Description: "${userDescription}"`,
    config: {
      systemInstruction: `You are an expert Process Architect at Shrestha Consolidated. Your goal is to find "Operational Gaps" like missed follow-ups, lazy data entry, or unknown AR.
      Return the analysis in a clean JSON format.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A concise summary of the situation." },
          identifiedGaps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of specific operational leaks found."
          },
          recommendedPlan: { type: Type.STRING, description: "The specific plan (A, B, C, or D) recommended." },
          roiEstimate: { type: Type.STRING, description: "Potential financial impact of fixing these gaps." }
        },
        required: ["summary", "identifiedGaps", "recommendedPlan", "roiEstimate"]
      }
    }
  });

  return JSON.parse(response.text) as GapAnalysisResult;
}
