export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: "API key missing" });

    try {
        const { message, file } = req.body;

        const parts = [];
        if (file?.data) {
            parts.push({
                inline_data: {
                    data: file.data, // Base64
                    mime_type: file.mime_type,
                },
            });
        }
        if (message) parts.push({ text: message });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts }] }),
            }
        );

        const text = await response.text();
        console.log("Gemini raw response:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return res.status(500).json({ error: "Invalid JSON from Gemini API", raw: text });
        }

        // Trả về chuẩn để frontend dễ lấy text
        const botText =
            data?.candidates?.[0]?.content?.[0]?.text ||
            "Xin lỗi, Gemini API không trả về gì.";

        return res.status(200).json({ text: botText });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error" });
    }
}
