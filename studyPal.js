const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

const app = express();

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Handle file upload
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  try {
    let textContent;

    // Determine the file type and extract text accordingly
    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      textContent = pdfData.text;
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      textContent = result.value;
    } else if (file.mimetype === "text/plain") {
      textContent = fs.readFileSync(file.path, "utf8");
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Now send the textContent to Gemini API
    const geminiResponse = await sendToGeminiAPI(textContent);

    // Respond to the frontend with the Gemini API response
    res.json(geminiResponse);
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  } finally {
    // Cleanup uploaded file
    fs.unlinkSync(file.path);
  }
});

// Mock function to send text to Gemini API
const sendToGeminiAPI = async (text) => {
  // Implement your Gemini API integration here
  return { summary: "Gemini API response for the given text" };
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
