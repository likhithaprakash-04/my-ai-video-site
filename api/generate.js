export default async function handler(req, res) {
  try {
    const testResponse = await fetch("https://httpbin.org/get");
    const testData = await testResponse.text();
    return res.status(200).json({ 
      success: true, 
      testStatus: testResponse.status,
      preview: testData.substring(0, 200)
    });
  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      cause: error.cause ? String(error.cause) : "no cause",
      stack: error.stack
    });
  }
}