import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { rateLimit } from "express-rate-limit";

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
  const envPort = process.env.PORT ? Number(process.env.PORT) : null;
  const isProduction = process.env.NODE_ENV === "production";

  console.log(`[EcoPulse] Mode: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`);
  console.log(`[EcoPulse] Env PORT: ${envPort}`);

  // Trust proxy for rate limiting (important for Cloud Run)
  app.set('trust proxy', 1);

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: "Too many requests, please try again later." }
  });

  // Apply the rate limiting middleware to all requests
  app.use(limiter);

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
      app.use(express.static(distPath, { index: false }));
    }

    app.get("*", (req, res) => {
      if (req.path.startsWith("/assets/") || req.path.includes(".")) {
        return res.status(404).send("Not found");
      }
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application not found.");
      }
    });
  }

  // Primary AIS Listener (Static 3000)
  app.listen(3000, "0.0.0.0", () => {
    console.log(`[EcoPulse] Main listener started on http://localhost:3000`);
  });

  // Secondary Cloud Run Listener (Dynamic PORT)
  if (envPort && envPort !== 3000) {
    try {
      app.listen(envPort, "0.0.0.0", () => {
        console.log(`[EcoPulse] Cloud Run listener started on http://localhost:${envPort}`);
      });
    } catch (err) {
      console.warn(`[EcoPulse] Secondary listener on port ${envPort} failed:`, err);
    }
  }
}

startServer();
