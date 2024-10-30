const fs = require("fs");
const { extractTextFromFile } = require("../utils/fileHelper");
const {
  sendToGeminiAPI,
  Note,
  Quiz,
  Tips,
} = require("../services/geminiService");

const truncateText = (text, limit = 5000) => {
  const words = text.split(/\s+/); // Split by whitespace
  return words.slice(0, limit).join(" ");
};

// Handle file uploads and summarize content
exports.summary = async (req, res) => {
  const file = req.file;

  try {
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const textContent = await extractTextFromFile(file);
    const truncatedText = truncateText(textContent);

    const geminiResponse = await sendToGeminiAPI(truncatedText);
    res.json({ geminiResponse });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  } finally {
    if (file?.path) fs.unlinkSync(file.path);
  }
};

exports.note = async (req, res) => {
  const file = req.file;

  try {
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const textContent = await extractTextFromFile(file);
    const truncatedText = truncateText(textContent);

    const geminiResponse = await Note(truncatedText);
    res.json(geminiResponse);
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  } finally {
    if (file?.path) fs.unlinkSync(file.path);
  }
};

exports.quiz = async (req, res) => {
  const file = req.file;

  try {
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const textContent = await extractTextFromFile(file);
    const truncatedText = truncateText(textContent);

    const geminiResponse = await Quiz(truncatedText);
    res.json(geminiResponse);
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  } finally {
    if (file?.path) fs.unlinkSync(file.path);
  }
};

exports.tips = async (req, res) => {
  const file = req.file;

  try {
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const textContent = await extractTextFromFile(file);
    const truncatedText = truncateText(textContent);

    const geminiResponse = await Tips(truncatedText);
    res.json(geminiResponse);
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  } finally {
    if (file?.path) fs.unlinkSync(file.path);
  }
};
