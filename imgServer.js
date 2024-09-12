require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import the cors package
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const app = express();
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

async function fileToGenerativePart(fileBuffer, mimeType) {
  return {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType: mimeType,
    },
  };
}

// Define a POST endpoint
app.post("/vision", upload.single("image"), async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file

    // Validate the input
    if (!file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Default system prompt to identify the item in the image
    const systemPrompt =
      "Identify the item in the image and respond in Yoruba. If the item is not identifiable, send a message saying so.";

    // Choose a Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Convert file to generative part
    const filePart = await fileToGenerativePart(file.buffer, file.mimetype);

    // Generate content using the default system prompt and file part
    const result = await model.generateContent([systemPrompt, filePart]);

    // Send the generated text as a response
    res.json({ text: await result.response.text() });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating content" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
