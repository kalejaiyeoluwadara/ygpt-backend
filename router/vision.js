const express = require("express");
const multer = require("multer");
const { processImage } = require("../controllers/visionController");

const router = express.Router();

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define the POST route for /vision
router.post("/summarise", upload.single("image"), processImage);

module.exports = router;
