require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI instance
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

/**
 * Sends text content to the Gemini API for summarization.
 * Limits the text content to avoid exceeding the API limits.
 * @param {string} textContent - The text content to send to the Gemini API.
 * @returns {Promise<Object>} - The response from the Gemini API.
 */
const sendToGeminiAPI = async (textContent) => {
  try {
    // Descriptive system prompt for summarizing educational material
    const prompt = `
      Summarize the following academic content in a clear, concise manner.
      Highlight key points, main ideas, and important details that are relevant for a student.
      The summary should be easy to understand and help with exam preparation or review.
      Focus on presenting the most critical aspects of the content:

      "${textContent}"
    `;

    // Choose the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Generate a summary using the Gemini model and the descriptive prompt
    const result = await model.generateContent([prompt]);

    // Return the summarized text
    return result.response.text();
  } catch (error) {
    console.error("Error sending content to Gemini API:", error);
    throw new Error("An error occurred while generating the summary.");
  }
};
const Tips = async (textContent) => {
  try {
    // Descriptive system prompt for summarizing educational material
    const prompt = `
  Based on the following academic content, generate practical reading tips that help students focus on the most important concepts, key points, and critical details.
  These tips should assist in better comprehension, retention of information, and efficient studying.
  Provide actionable advice for how to approach reading and reviewing this content:

  "Generate reading tips from: ${textContent}"
`;
    // Choose the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Generate a summary using the Gemini model and the descriptive prompt
    const result = await model.generateContent([prompt]);

    // Return the summarized text
    return result.response.text();
  } catch (error) {
    console.error("Error sending content to Gemini API:", error);
    throw new Error("An error occurred while generating the summary.");
  }
};
const Note = async (textContent) => {
  try {
    // Descriptive system prompt for summarizing educational material
    const prompt = `
  Create a concise short note from the following content that captures the essential points and key concepts. The note should be brief, easy to understand, and highlight the most important information for quick reference or revision:


  "Generate short note from: ${textContent}"
`;
    // Choose the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Generate a summary using the Gemini model and the descriptive prompt
    const result = await model.generateContent([prompt]);

    // Return the summarized text
    return result.response.text();
  } catch (error) {
    console.error("Error sending content to Gemini API:", error);
    throw new Error("An error occurred while generating the summary.");
  }
};
const Quiz = async (textContent) => {
  try {
    // Descriptive system prompt for summarizing educational material
    const prompt = `
 Create a quiz based on the following academic content. The quiz should be as many subjective questions as possible, to assess comprehension of key concepts and important details. Ensure that the questions challenge students' understanding and encourage critical thinking related to the material, give the answers below the quiz:
 ${textContent}"
`;
    // Choose the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Generate a summary using the Gemini model and the descriptive prompt
    const result = await model.generateContent([prompt]);

    // Return the summarized text
    return result.response.text();
  } catch (error) {
    console.error("Error sending content to Gemini API:", error);
    throw new Error("An error occurred while generating the summary.");
  }
};

module.exports = { sendToGeminiAPI, Tips, Quiz, Note };
