export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const body = req.body;
        if (!body || !body.file || !body.file.data || body.file.data.length === 0) {
            return res.status(400).json({ error: "File data missing" });
        }

        // Ví dụ gọi API bên ngoài
        const externalRes = await fetch("EXTERNAL_API_URL", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const text = await externalRes.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { raw: text };
        }

        res.status(200).json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
