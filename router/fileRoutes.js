const express = require("express");
const multer = require("multer");
const { processFile } = require("../controllers/fileController");

const router = express.Router();

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// Define the POST route for file uploads
router.post("/summarise", upload.single("file"), processFile);

module.exports = router;
