import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

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
        { id: 3, title: "Report Translation (PT/EN)", org: "WWF International", skill: "Languages", hours: 0.5, type: "Remote", time: "15 min" },
        { id: 4, title: "Satellite Image Identification", org: "Zero Deforestation Project", skill: "Visual Analysis", hours: 0.2, type: "Remote", time: "10 min" },
      ]);
    }
  });

  // Training API
  app.get("/api/training", (req, res) => {
    res.json([
      { id: 1, title: "Circular Economy Basics", duration: "2h", level: "Beginner", provider: "WWF Academy" },
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
