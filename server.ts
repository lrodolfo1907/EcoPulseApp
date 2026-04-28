import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "EcoPulse API is running" });
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
