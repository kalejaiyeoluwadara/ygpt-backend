const express = require("express");
const multer = require("multer");
const audioController = require("../controllers/audioController");

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// POST route to handle audio file upload
router.post("/", upload.single("audioFile"), audioController.uploadAudio);

module.exports = router;
