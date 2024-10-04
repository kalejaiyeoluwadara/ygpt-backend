require("dotenv").config();
const express = require("express");
const cors = require("cors");
const visionRoutes = require("./router/vision");
const fileRoutes = require("./router/fileRoutes");
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Enable JSON parsing
app.use(express.json());

// Setup routes
app.use("/vision", visionRoutes);
app.use("/studypal", fileRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
