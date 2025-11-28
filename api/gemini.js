export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const { message, file } = req.body;

        // Gọi API Gemini
        const apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    { parts: [{ text: message }] }
                ]
            })
        });

        const data = await apiRes.json();
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: "Server error", detail: err.message });
    }
}
