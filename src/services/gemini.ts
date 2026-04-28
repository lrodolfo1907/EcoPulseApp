import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
      return null;
    }
    genAI = new GoogleGenAI(apiKey);
  }
  return genAI;
}

export async function getEcoTip(userContext?: string) {
  const ai = getGenAI();
  if (!ai) return "Small changes lead to big impacts. Try reducing your meat consumption once a week!";
  
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are an expert sustainability consultant. Your tips are concise, evidence-based, and encouraging. Avoid generic advice like 'recycle more' unless it's a specific, lesser-known recycling tip.",
    });

    const result = await model.generateContent(`Provide a short, actionable, and surprising sustainability tip. ${userContext ? `Context: ${userContext}` : ""}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error fetching eco tip:", error);
    return "Small changes lead to big impacts. Try reducing your meat consumption once a week!";
  }
}

export async function chatWithEcoBot(message: string, history: { role: string, text: string }[]) {
  const ai = getGenAI();
  if (!ai) return "I'm having trouble connecting right now (API key missing). Please try again later!";

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are EcoBot, the official assistant for the EcoPulse app. Answer questions about the app's features (Carbon Calculator, Local/Global Initiatives, Eco-Academy Training, Community Challenges, Green Hours) and general environmental/sustainability topics. Be concise, friendly, and encouraging. If asked about unrelated topics, politely steer the conversation back to sustainability or the app.",
    });

    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const result = await model.generateContent({ contents });
    const response = await result.response;
    return response.text();
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
  const ai = getGenAI();
  if (!ai) return null;

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `Calculate the estimated weekly carbon footprint (kg CO2e) for: 
      - Transport: ${data.transport} km/week
      - Energy: ${data.energy} kWh/month
      - Diet: ${data.diet}
      Return ONLY a JSON object with 'total', 'breakdown' (object with transport, energy, diet), and 'suggestion'.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Error calculating footprint:", error);
    return null;
  }
}
