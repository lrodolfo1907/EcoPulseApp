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

export async function chatWithEcoBot(message: string, history: { role: string, text: string }[]) {
  try {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: "You are EcoBot, the official assistant for the EcoPulse app. Answer questions about the app's features (Carbon Calculator, Local/Global Initiatives, Eco-Academy Training, Community Challenges, Green Hours) and general environmental/sustainability topics. Be concise, friendly, and encouraging. If asked about unrelated topics, politely steer the conversation back to sustainability or the app.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error in EcoBot chat:", error);
    return "I'm having trouble connecting right now. Please try again later!";
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
