export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const API_KEY = process.env.HF_API_KEY;

  try {
    const hfResponse = await fetch(
      "https://router.huggingface.co/fal-ai/fal-ai/ltx-video",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt })
      }
    );

    const responseText = await hfResponse.text();

    // Always return what HF actually said, even on failure,
    // so we can see the real reason instead of guessing
    if (!hfResponse.ok) {
      return res.status(hfResponse.status).json({
        error: "Hugging Face API error",
        status: hfResponse.status,
        details: responseText
      });
    }

    const data = JSON.parse(responseText);
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
      cause: error.cause ? String(error.cause) : "no cause"
    });
  }
}