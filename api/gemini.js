// api/gemini.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const API_KEY = process.env.GEMINI_KEY;
    if (!API_KEY) {
        return res.status(500).json({ error: 'Missing API key (set GEMINI_KEY in Vercel env)' });
    }

    try {
        const { message, file } = req.body || {};

        if (!message && !file) {
            return res.status(400).json({ error: 'Missing message or file' });
        }

        const parts = [];
        if (message) parts.push({ text: message });
        if (file?.data) {
            parts.push({
                inline_data: {
                    data: file.data, // base64 string
                    mime_type: file.mime_type || 'application/octet-stream'
                }
            });
        }

        const payload = {
            contents: [{ parts }]
        };

        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

        const upstream = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const text = await upstream.text();
        let result;
        try { result = JSON.parse(text); } catch (e) { result = { raw: text }; }

        if (!upstream.ok) {
            return res.status(upstream.status).json({ error: 'Upstream error', details: result });
        }

        return res.status(200).json(result);

    } catch (err) {
        console.error('API handler error:', err);
        return res.status(500).json({ error: err.message || String(err) });
    }
}
