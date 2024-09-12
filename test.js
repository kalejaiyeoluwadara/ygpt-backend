require("dotenv").config();
const express = require("express");
const {
  GoogleGenerativeAI,
  GenerativeModel,
} = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.json({ text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while generating text" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
