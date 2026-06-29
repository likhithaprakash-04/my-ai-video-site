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
      "https://router.huggingface.co/hf-inference/models/Wan-AI/Wan2.1-T2V-14B",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_frames: 49,
            fps: 8,
            width: 832,
            height: 480,
          }
        })
      }
    );

    if (!hfResponse.ok) {
      const errText = await hfResponse.text();
      return res.status(hfResponse.status).json({ error: errText });
    }

    const arrayBuffer = await hfResponse.arrayBuffer();
    res.setHeader("Content-Type", "video/mp4");
    res.status(200).send(Buffer.from(arrayBuffer));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}