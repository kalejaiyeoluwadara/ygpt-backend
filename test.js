const express = require("express");
const multer = require("multer");
const pptx2json = require("pptx2json");
const path = require("path");
const fs = require("fs");

const app = express();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a timestamp
  },
});

const upload = multer({ storage });

// Endpoint to upload and extract text from .ppt/.pptx files
app.post("/upload", upload.single("pptFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = req.file.path;

  // Use pptx2json to extract content from the .pptx/.ppt file
  pptx2json(filePath)
    .then((data) => {
      // Extract text from the slides
      const extractedText = data.map((slide) => slide.text).join(" ");

      // Send extracted text as response
      res.send({ extractedText });

      // Delete the file after processing
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    })
    .catch((err) => {
      res.status(500).send("Error extracting text from file.");
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
