export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { message, file } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Missing message" });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        const apiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: message }],
                        },
                    ],
                }),
            }
        );

        const data = await apiResponse.json();

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({
            error: "Server error",
            detail: err.message
        });
    }
}
