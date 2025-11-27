export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: "API key missing" });

    try {
        const { message, file } = req.body;

        // Tạo parts gửi đi
        const parts = [];
        if (file?.data) {
            parts.push({
                inline_data: { data: file.data, mime_type: file.mime_type }
            });
        }
        if (message) parts.push({ text: message });

        // Nếu parts rỗng, thêm text mặc định để tránh rỗng
        if (parts.length === 0) parts.push({ text: "Xin chào!" });

        // Gửi request đến Gemini
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts }] })
            }
        );

        const rawText = await response.text();
        console.log("Gemini raw response:", rawText);

        let data;
        try {
            data = JSON.parse(rawText);
        } catch {
            return res.status(500).json({ text: "Gemini API trả về JSON không hợp lệ", raw: rawText });
        }

        // Lấy text trả về từ API (nếu có candidates)
        const botText =
            data?.candidates?.[0]?.content?.[0]?.text ||
            "Hicc. Google fix chatbot roii cau aa.";

        return res.status(200).json({ text: botText });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ text: "Server Error" });
    }
}
