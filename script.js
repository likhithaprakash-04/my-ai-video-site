async function generateVideo() {
  const prompt = document.getElementById("prompt").value.trim();

  if (!prompt) {
    alert("Please write a description for your video!");
    return;
  }

  // Show loading
  document.getElementById("loading").style.display = "block";
  document.getElementById("result").style.display = "none";
  document.getElementById("error").style.display = "none";
  document.getElementById("generateBtn").disabled = true;

  try {
    // Calls OUR OWN backend function, not Hugging Face directly.
    // The real API key stays hidden on the server.
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt })
    });

    if (!response.ok) {
      throw new Error("Video generation failed. Try again!");
    }

    const blob = await response.blob();
    const videoUrl = URL.createObjectURL(blob);

    document.getElementById("videoPlayer").src = videoUrl;
    document.getElementById("downloadBtn").href = videoUrl;
    document.getElementById("result").style.display = "block";

  } catch (error) {
    document.getElementById("error").style.display = "block";
    document.getElementById("error").textContent =
      "Error: " + error.message + " — Please try again!";
  } finally {
    document.getElementById("loading").style.display = "none";
    document.getElementById("generateBtn").disabled = false;
  }
}