import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set.");
      return null;
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";

  console.log(`[EcoPulse] Mode: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`);
  console.log(`[EcoPulse] Port: ${PORT}`);

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "EcoPulse API is running", mode: isProduction ? "production" : "development" });
  });

  // AI Routes
  app.post("/api/ai/tip", async (req, res) => {
    try {
      const { userContext, lang = 'en' } = req.body;
      const ai = getGenAI();
      if (!ai) return res.status(503).json({ error: "AI service unavailable" });

      const langMap: Record<string, string> = {
        'pt': 'Portuguese',
        'es': 'Spanish',
        'en': 'English'
      };
      const responseLang = langMap[lang] || 'English';

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are an expert sustainability consultant. Your tips are concise, evidence-based, and encouraging. Respond in ${responseLang}. Avoid generic advice like 'recycle more' unless it's a specific, lesser-known recycling tip.`,
        },
        contents: `Provide a short, actionable, and surprising sustainability tip. ${userContext ? `Context: ${userContext}` : ""}`
      });
      res.json({ text: result.text });
    } catch (error) {
      console.error("AI Tip Error:", error);
      res.status(500).json({ error: "Failed to generate tip" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history, lang = 'en' } = req.body;
      const ai = getGenAI();
      if (!ai) return res.status(503).json({ error: "AI service unavailable" });

      const langMap: Record<string, string> = {
        'pt': 'Portuguese',
        'es': 'Spanish',
        'en': 'English'
      };
      const responseLang = langMap[lang] || 'English';

      const contents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are EcoBot, the official assistant for the EcoPulse app. Respond in ${responseLang}. Answer questions about the app's features (Carbon Calculator, Local/Global Initiatives, Eco-Academy Training, Community Challenges, Green Hours) and general environmental/sustainability topics. Be concise, friendly, and encouraging. If asked about unrelated topics, politely steer the conversation back to sustainability or the app.`,
        },
        contents
      });
      res.json({ text: result.text });
    } catch (error) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: "Failed to process chat" });
    }
  });

  app.post("/api/ai/calculate", async (req, res) => {
    try {
      const { transport, energy, diet, lang = 'en' } = req.body;
      const ai = getGenAI();
      if (!ai) return res.status(503).json({ error: "AI service unavailable" });

      const langMap: Record<string, string> = {
        'pt': 'Portuguese',
        'es': 'Spanish',
        'en': 'English'
      };
      const responseLang = langMap[lang] || 'English';

      const prompt = `Calculate the estimated weekly carbon footprint (kg CO2e) for: 
        - Transport: ${transport} km/week
        - Energy: ${energy} kWh/month
        - Diet: ${diet}
        Return ONLY a JSON object with 'total', 'breakdown' (object with transport, energy, diet), and 'suggestion' (in ${responseLang}).`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          responseMimeType: "application/json",
        },
        contents: prompt
      });
      res.json(JSON.parse(result.text || '{}'));
    } catch (error) {
      console.error("AI Calculate Error:", error);
      res.status(500).json({ error: "Failed to calculate footprint" });
    }
  });

  // Email API
  app.post("/api/email/confirm-join", async (req, res) => {
    try {
      const { email, name, challengeTitle } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Generate a test account on the fly (Ethereal) to mock email sending
      const testAccount = await nodemailer.createTestAccount();
      
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });

      const info = await transporter.sendMail({
        from: '"EcoPulse Community" <noreply@ecopulse.app>',
        to: email,
        subject: `You joined the challenge: ${challengeTitle}`,
        text: `Hello ${name || 'Eco Warrior'},\n\nThank you for joining the challenge "${challengeTitle}"! We are excited to see you make an impact.\n\nBest,\nThe EcoPulse Team`,
        html: `<p>Hello <b>${name || 'Eco Warrior'}</b>,</p><p>Thank you for joining the challenge "<b>${challengeTitle}</b>"!</p><p>We are excited to see you make an impact.</p><br/><p>Best,<br/>The EcoPulse Team</p>`,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", previewUrl);

      res.json({ success: true, previewUrl });
    } catch (error) {
      console.error("Failed to send email", error);
      res.status(500).json({ error: "Failed to send email confirmation" });
    }
  });

  // Mock data for carbon footprint
  app.get("/api/stats", (req, res) => {
    res.json({
      carbonSaved: 125.4,
      greenHours: 42,
      energyUsage: [
        { name: "Mon", value: 45 },
        { name: "Tue", value: 52 },
        { name: "Wed", value: 38 },
        { name: "Thu", value: 65 },
        { name: "Fri", value: 48 },
        { name: "Sat", value: 30 },
        { name: "Sun", value: 25 },
      ],
      tips: [
        "Switch to LED bulbs to save up to 75% energy.",
        "Unplug electronics when not in use.",
        "Use a programmable thermostat.",
      ]
    });
  });

  // Initiatives API
  app.get("/api/initiatives", (req, res) => {
    const type = req.query.type || "local";
    if (type === "local") {
      res.json([
        { id: 1, title: "Cleanup Drive - Guanabara Bay", org: "Urban Sea Institute", dist: "5km", hours: 3, type: "In-Person", verified: true },
        { id: 2, title: "Flora Mapping - Tijuca Forest", org: "SOS Atlantic Forest", dist: "8km", hours: 4, type: "In-Person", verified: false },
      ]);
    } else {
      res.json([
        { id: 3, title: "Report Translation (PT/EN)", org: "Global EcoPartners", skill: "Languages", hours: 0.5, type: "Remote", time: "15 min" },
        { id: 4, title: "Satellite Image Identification", org: "Zero Deforestation Project", skill: "Visual Analysis", hours: 0.2, type: "Remote", time: "10 min" },
      ]);
    }
  });

  // Training API
  app.get("/api/training", (req, res) => {
    res.json([
      { id: 1, title: "Circular Economy Basics", duration: "2h", level: "Beginner", provider: "EcoPulse Academy" },
      { id: 2, title: "Climate Advocacy 101", duration: "5h", level: "Intermediate", provider: "Greenpeace Education" },
      { id: 3, title: "Sustainable Urban Planning", duration: "10h", level: "Advanced", provider: "UN-Habitat" },
    ]);
  });

  // Vite middleware for development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    if (fs.existsSync(distPath)) {
      console.log(`[EcoPulse] Serving static files from: ${distPath}`);
      
      // Log files in dist/assets for debugging
      const assetsPath = path.join(distPath, "assets");
      if (fs.existsSync(assetsPath)) {
        const files = fs.readdirSync(assetsPath);
        console.log(`[EcoPulse] Assets found: ${files.join(", ")}`);
      }

      app.use(express.static(distPath, {
        index: false
      }));
    } else {
      console.error("[EcoPulse] CRITICAL: 'dist' folder NOT FOUND!");
    }

    // Catch-all route for SPA
    app.get("*", (req, res) => {
      // Don't serve index.html for missing assets
      if (req.path.startsWith("/assets/") || req.path.includes(".")) {
        console.warn(`[EcoPulse] Asset not found: ${req.path}`);
        return res.status(404).send("Not found");
      }

      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        // Aggressive Cache-Busting for SPA entry point
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.setHeader("Surrogate-Control", "no-store");
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application not found. Please ensure 'npm run build' was executed successfully.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
