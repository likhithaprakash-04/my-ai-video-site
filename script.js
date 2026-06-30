async function generateVideo() {
  const prompt = document.getElementById("prompt").value.trim();

  if (!prompt) {
    alert("Please write a description for your video!");
    return;
  }

  document.getElementById("loading").style.display = "block";
  document.getElementById("result").style.display = "none";
  document.getElementById("error").style.display = "none";
  document.getElementById("generateBtn").disabled = true;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details || data.error || "Video generation failed");
    }

    const videoUrl = data.video?.url || data.url;

    if (!videoUrl) {
      throw new Error("Response succeeded but no video URL found: " + JSON.stringify(data));
    }

    document.getElementById("videoPlayer").src = videoUrl;
    document.getElementById("downloadBtn").href = videoUrl;
    document.getElementById("result").style.display = "block";

  } catch (error) {
    document.getElementById("error").style.display = "block";
    document.getElementById("error").textContent =
      "Error: " + error.message;
  } finally {
    document.getElementById("loading").style.display = "none";
    document.getElementById("generateBtn").disabled = false;
  }
}