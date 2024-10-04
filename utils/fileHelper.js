const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extracts text content from a given file based on its MIME type.
 * @param {Object} file - The file object uploaded by the user.
 * @returns {Promise<string>} - Extracted text content.
 */
exports.extractTextFromFile = async (file) => {
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
    throw new Error("Unsupported file type");
  }

  return textContent;
};
// Converts file buffer to the required generative part format
exports.fileToGenerativePart = async (fileBuffer, mimeType) => {
  return {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType: mimeType,
    },
  };
};
