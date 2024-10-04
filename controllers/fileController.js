const fs = require("fs");
const path = require("path");
const { extractTextFromFile } = require("../utils/fileHelper");

// Handle the uploaded file and process it
exports.processFile = async (req, res) => {
  const file = req.file;

  try {
    // Check if a file was uploaded
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract text content from the uploaded file
    const textContent = await extractTextFromFile(file);

    // Send the extracted text content to the Gemini API
    const geminiResponse = await sendToGeminiAPI(textContent);

    // Respond with the Gemini API result
    res.json(geminiResponse);
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  } finally {
    if (file && file.path) {
      // Cleanup: Remove the uploaded file from the server
      fs.unlinkSync(file.path);
    }
  }
};

// Mock function to send text to the Gemini API
const sendToGeminiAPI = async (text) => {
  // Implement your Gemini API integration logic here
  return { summary: "Gemini API response for the given text" };
};
