export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { chatHistory } = req.body;

        if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length === 0) {
            return res.status(400).json({ error: "chatHistory is empty or invalid" });
        }

        // Chuyển chatHistory thành định dạng Gemini
        const contents = chatHistory.map(msg => ({
            parts: msg.parts.map(p => ({
                text: p.text || ""
            }))
        }));

        const apiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents })
            }
        );

        const data = await apiRes.json();

        // Fallback nếu API trả không đúng định dạng
        const fallback = "Bot không trả lời được 😢";
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallback;

        return res.status(200).json({
            candidates: [
                { content: { parts: [{ text: responseText }] } }
            ]
        });

    } catch (err) {
        return res.status(500).json({ error: "Server error", detail: err.message });
    }
}
