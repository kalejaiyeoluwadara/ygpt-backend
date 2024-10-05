// fileConverter.js
const { exec } = require("child_process");
const path = require("path");

/**
 * Converts a PowerPoint file to PDF format.
 * @param {string} pptPath - The path of the PowerPoint file.
 * @returns {Promise<string>} - The path to the converted PDF file.
 */
const convertPptToPdf = (pptPath) => {
  return new Promise((resolve, reject) => {
    const pdfPath = pptPath.replace(/\.(ppt|pptx)$/, ".pdf"); // Change extension to .pdf
    exec(
      `libreoffice --headless --convert-to pdf ${pptPath} --outdir ${path.dirname(
        pptPath
      )}`,
      (error) => {
        if (error) {
          return reject(`Conversion error: ${error.message}`);
        }
        resolve(pdfPath);
      }
    );
  });
};

module.exports = { convertPptToPdf };
