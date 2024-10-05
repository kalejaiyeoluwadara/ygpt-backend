const fs = require("fs");
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
  } else if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    file.mimetype === "application/vnd.ms-powerpoint"
  ) {
    // Return a message indicating that .ppt and .pptx files are not accepted
    textContent = "unsopported file";
  } else {
    textContent = "unsopported file";
  }

  return textContent;
};
