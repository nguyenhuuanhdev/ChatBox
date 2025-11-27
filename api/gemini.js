// /api/gemini.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    try {
        const { message, file } = req.body;

        const result = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                file?.data
                                    ? {
                                        inline_data: {
                                            data: file.data,
                                            mime_type: file.mime_type,
                                        },
                                    }
                                    : null,
                                { text: message || "" },
                            ].filter(Boolean),
                        },
                    ],
                }),
            }
        );

        const data = await result.json();
        return res.status(200).json({ output: data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error" });
    }
}
