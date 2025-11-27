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
                    data: file.data, // đảm bảo đây là base64
                    mime_type: file.mime_type,
                },
            });
        }
        if (message) parts.push({ text: message });

        const result = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts }] }),
            }
        );

        const text = await result.text();
        console.log("Gemini response:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return res.status(500).json({ error: "Invalid JSON from Gemini API", raw: text });
        }

        return res.status(200).json({ output: data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error" });
    }
}
