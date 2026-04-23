import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database for intelligence data
  const INTEL_DB = [
    { id: '1', type: 'domain', value: 'dark-ops-proxy.net', context: 'Identified in recent scan', severity: 'medium' },
    { id: '2', type: 'ip', value: '192.168.1.45', context: 'Resolves to Cloudflare node', severity: 'info' },
    { id: '3', type: 'social', value: '@ghost_strike', context: 'Active on Telegram', severity: 'medium' },
    { id: '4', type: 'crypto', value: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', context: 'Received 2.4 BTC', severity: 'high' },
    { id: '5', type: 'email', value: 'admin@target.io', context: 'Found in Breach_02', severity: 'critical' },
    { id: '6', type: 'domain', value: 'target.io', context: 'Primary target', severity: 'critical' },
    { id: '7', type: 'social', value: '@admin_ops', context: 'Linked to 192.168.1.1', severity: 'high' },
    { id: '8', type: 'breach', value: 'Breach_02', context: 'Contains 14k records', severity: 'high' }
  ];

  // Global search API endpoint
  app.get("/api/search", (req, res) => {
    const query = req.query.q as string;
    
    if (!query) {
      return res.json({ results: [] });
    }

    const lowerQuery = query.toLowerCase();
    
    // Search across value, type, and context
    const results = INTEL_DB.filter(item => 
      item.value.toLowerCase().includes(lowerQuery) ||
      item.type.toLowerCase().includes(lowerQuery) ||
      item.context.toLowerCase().includes(lowerQuery)
    );

    // Add a slight artificial delay to simulate real DB search
    setTimeout(() => {
      res.json({ results });
    }, 400);
  });

  // AI Report Generation Endpoint
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { targetData } = req.body;
      
      const prompt = `You are the AEGIS-ULTIMA internal AI synthesis engine (NEXUS). Provide a brief, tactical intelligence summary (max 2-3 short paragraphs) based on this graph node data:
${JSON.stringify(targetData, null, 2)}

Focus on associated risks, lateral movement possibilities, and recommended actions. Format using clean Markdown. Do NOT use emojis. Be direct and analytical.`;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      res.json({ report: response.text });
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate nexus report." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
