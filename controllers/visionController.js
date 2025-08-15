require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { fileToGenerativePart } = require("../utils/fileHelper");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

exports.processImage = async (req, res) => {
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
};
exports.identifyItem = async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file

    // Validate the input
    if (!file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Updated system prompt to get structured output
    const systemPrompt = `Analyze the image and identify the item. Respond with a JSON object in this exact format:
    {
      "itemname": "the name of the item",
      "description": "a detailed description of the item"
    }
    
    If the item is not identifiable, respond with:
    {
      "itemname": "unidentifiable",
      "description": "The item in this image cannot be clearly identified"
    }
    
    Ensure your response is valid JSON.`;

    // Choose a Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Convert file to generative part
    const filePart = await fileToGenerativePart(file.buffer, file.mimetype);

    // Generate content using the updated system prompt and file part
    const result = await model.generateContent([systemPrompt, filePart]);
    const responseText = await result.response.text();

    // Try to parse the response as JSON
    try {
      // First, try to extract JSON from markdown code blocks if present
      let jsonText = responseText;
      const codeBlockMatch = responseText.match(
        /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
      );
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1];
      }

      const parsedResponse = JSON.parse(jsonText);

      // Validate the response structure
      if (parsedResponse.itemname && parsedResponse.description) {
        res.json({
          itemname: parsedResponse.itemname,
          description: parsedResponse.description,
        });
      } else {
        // If the response doesn't have the expected structure, return a fallback
        res.json({
          itemname: "unidentifiable",
          description: "Unable to parse the AI response properly",
        });
      }
    } catch (parseError) {
      // If JSON parsing fails, try to extract information from the text
      console.warn("Failed to parse JSON response:", parseError);

      // Fallback: try to extract item name and description from the text
      const fallbackResponse = {
        itemname: "unidentifiable",
        description: responseText || "Unable to process the image",
      };

      res.json(fallbackResponse);
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating content" });
  }
};
