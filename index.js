require("dotenv").config();
const express = require("express");
const cors = require("cors");
const visionRoutes = require("./router/vision");
const fileRoutes = require("./router/fileRoutes");
const app = express();
const port = process.env.PORT || 5000;
const audioRoutes = require("./router/audioRoute");
// Enable CORS for all routes
app.use(cors());

// Enable JSON parsing
app.use(express.json());

// Setup routes
app.get("/", (req, res) => {
  res.send(`<h1>Welcome to YGPT</h1>`);
});
app.use("/vision", visionRoutes);
app.use("/studypal", fileRoutes);
app.use("/audio", audioRoutes);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
