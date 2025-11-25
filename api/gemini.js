export default async function handler(req, res) {
    const API_KEY = process.env.GEMINI_KEY; // key được giấu trong Vercel

    if (!API_KEY) {
        return res.status(500).json({ error: "Missing API Key" });
    }

    let body = "";
    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", async () => {
        try {
            const { message, file } = JSON.parse(body);

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

            const payload = {
                contents: [
                    {
                        parts: [
                            { text: message || "" },
                            file?.data
                                ? {
                                    inline_data: {
                                        data: file.data,
                                        mime_type: file.mime_type,
                                    }
                                }
                                : null
                        ].filter(Boolean)
                    }
                ]
            };

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: err.toString() });
        }
    });
}
