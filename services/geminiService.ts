import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateHRResponse = async (query: string, context: string): Promise<string> => {
  if (!apiKey) {
    return "AI Assistant is unavailable. Please check the API configuration.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful and professional HR Assistant for a company called 'Employee Management System (EMS)'. 
    Your goal is to assist employees with questions about leave policies, salary breakdowns, and attendance rules.
    
    Current User Context: ${context}
    
    Keep answers concise, polite, and strictly related to HR topics. If you don't know an answer, suggest contacting the HR department directly.`;

    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the HR knowledge base right now.";
  }
};