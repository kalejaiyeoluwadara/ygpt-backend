const fs = require("fs");
const path = require("path");

// Directory where files are stored
const directoryPath = path.join(__dirname, "uploads");

// Function to delete old files
const deleteOldFiles = (days) => {
  const now = Date.now();
  const expirationTime = days * 24 * 60 * 60 * 1000; // Convert days to milliseconds

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (now - stats.mtimeMs > expirationTime) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log(`Deleted old file: ${file}`);
            }
          });
        }
      });
    });
  });
};

// Call the function every 24 hours
setInterval(() => deleteOldFiles(1), 24 * 60 * 60 * 1000); // Adjust days as needed
