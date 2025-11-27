import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 3000;

app.post("/api/chat", async (req, res) => {
    try {
        const body = req.body;
        if (!body) return res.status(400).json({ error: "Missing body" });

        const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_KEY}`;

        const googleResp = await fetch(googleUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await googleResp.json();
        if (!googleResp.ok) return res.status(googleResp.status).json({ error: data });
        return res.json(data);
    } catch (err) {
        console.error("Proxy error:", err);
        return res.status(500).json({ error: err.message || "Server error" });
    }
});

app.listen(PORT, () => console.log(`Proxy server listening on port ${PORT}`));
