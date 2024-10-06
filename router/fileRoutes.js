const express = require("express");
const multer = require("multer");
const { summary, note, quiz, tips } = require("../controllers/fileController");

const router = express.Router();

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// Define the POST route for file uploads
router.post("/summarise", upload.single("file"), summary);
router.post("/note", upload.single("file"), note);
router.post("/quiz", upload.single("file"), quiz);
router.post("/tips", upload.single("file"), tips);

module.exports = router;
