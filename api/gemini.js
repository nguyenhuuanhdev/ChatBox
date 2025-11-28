export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "Message is empty" });
        }

        // Gọi API Gemini 2.5
        const apiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // Đảm bảo cấu trúc luôn có candidates[0].content.parts[0].text
                    contents: [
                        { parts: [{ text: message }] }
                    ]
                })
            }
        );

        const data = await apiRes.json();

        // Fallback nếu API trả không đúng định dạng
        if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return res.status(200).json({
                candidates: [
                    { content: { parts: [{ text: "Bot không trả lời được 😢" }] } }
                ]
            });
        }

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: "Server error", detail: err.message });
    }
}
