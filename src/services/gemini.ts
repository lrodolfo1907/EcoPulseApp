import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEcoTip(userContext?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a short, actionable, and surprising sustainability tip. ${userContext ? `Context: ${userContext}` : ""}`,
      config: {
        systemInstruction: "You are an expert sustainability consultant. Your tips are concise, evidence-based, and encouraging. Avoid generic advice like 'recycle more' unless it's a specific, lesser-known recycling tip.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching eco tip:", error);
    return "Small changes lead to big impacts. Try reducing your meat consumption once a week!";
  }
}

export async function calculateCarbonFootprint(data: {
  transport: number; // km per week
  energy: number; // kWh per month
  diet: string; // vegan, vegetarian, omnivore
}) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Calculate the estimated weekly carbon footprint (kg CO2e) for: 
      - Transport: ${data.transport} km/week
      - Energy: ${data.energy} kWh/month
      - Diet: ${data.diet}
      Return ONLY a JSON object with 'total', 'breakdown' (object with transport, energy, diet), and 'suggestion'.`,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error calculating footprint:", error);
    return null;
  }
}
