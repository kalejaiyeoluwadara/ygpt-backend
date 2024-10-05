// controllers/fileController.js

const fs = require("fs");
const path = require("path");
const { extractTextFromFile } = require("../utils/fileHelper");
const { sendToGeminiAPI } = require("../services/geminiService");

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

    // Send the extracted text content to the Gemini API for summarization
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
