// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // nêu file base64 lớn
const PORT = process.env.PORT || 3000;

// Route test
app.get("/ping", (req, res) => res.json({ ok: true }));

// Proxy route: nhận body từ frontend rồi forward tới Google Generative API
app.post("/api/chat", async (req, res) => {
    try {
        const body = req.body; // frontend gửi { contents: chatHistory } hoặc { prompt: ... }
        if (!body) return res.status(400).json({ error: "Missing body" });

        // Build Google API url (key from env)
        const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_KEY}`;

        // Forward request
        const googleResp = await fetch(googleUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await googleResp.json();
        if (!googleResp.ok) {
            // trả lỗi nguyên vẹn để debug
            return res.status(googleResp.status).json({ error: data });
        }
        // trả lại response google cho frontend
        return res.json(data);
    } catch (err) {
        console.error("Proxy error:", err);
        return res.status(500).json({ error: err.message || "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server listening on http://localhost:${PORT}`);
});
