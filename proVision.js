require("dotenv").config();
const fs = require("fs/promises");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize GoogleGenerativeAI with your API_KEY.
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function fileToGenerativePart(filePath, mimeType) {
  const fileData = await fs.readFile(filePath);
  return {
    inlineData: {
      data: fileData.toString("base64"),
      mimeType: mimeType, // Ensure the correct MIME type is added
    },
  };
}

async function run() {
  // Choose a Gemini model.
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // Define the prompt
  const prompt = "";

  // Upload files and generate their corresponding parts
  const filePart1 = await fileToGenerativePart("image.png", "image/png");

  // Generate content using the prompt and file parts
  const result = await model.generateContent([prompt, filePart1]);

  // Output the generated text to the console
  console.log(result.response.text());
}

// Run the script
run();
