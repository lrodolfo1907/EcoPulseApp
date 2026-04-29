export async function getEcoTip(userContext?: string, lang: string = 'en') {
  try {
    const response = await fetch("/api/ai/tip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userContext, lang }),
    });
    if (!response.ok) throw new Error("Failed to fetch tip");
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error fetching eco tip:", error);
    return "Small changes lead to big impacts. Try reducing your meat consumption once a week!";
  }
}

export async function chatWithEcoBot(message: string, history: { role: string, text: string }[], lang: string = 'en') {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, lang }),
    });
    if (!response.ok) throw new Error("Failed to chat with bot");
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error in EcoBot chat:", error);
    return "I'm having trouble connecting right now. Please try again later!";
  }
}

export async function calculateCarbonFootprint(data: {
  transport: number; // km per week
  energy: number; // kWh per month
  diet: string; // vegan, vegetarian, omnivore
  lang?: string;
}) {
  try {
    const response = await fetch("/api/ai/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to calculate footprint");
    return await response.json();
  } catch (error) {
    console.error("Error calculating footprint:", error);
    return null;
  }
}
