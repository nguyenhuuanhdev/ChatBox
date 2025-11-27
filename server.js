// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Cho phép domain Vercel
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://nguyenhuuanh.vercel.app',
        'https://*.vercel.app' // Cho phép tất cả preview deployments
    ],
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

// Route test
app.get("/ping", (req, res) => res.json({ ok: true }));

// Serve index.html cho root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Proxy route
app.post("/api/chat", async (req, res) => {
    try {
        const body = req.body;
        if (!body) return res.status(400).json({ error: "Missing body" });

        const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_KEY}`;

        const googleResp = await fetch(googleUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await googleResp.json();
        if (!googleResp.ok) {
            return res.status(googleResp.status).json({ error: data });
        }
        return res.json(data);
    } catch (err) {
        console.error("Proxy error:", err);
        return res.status(500).json({ error: err.message || "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export cho Vercel
export default app;