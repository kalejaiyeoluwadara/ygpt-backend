import { getTextExtractor } from "office-text-extractor";
import path from "path"; // To handle file paths correctly

(async () => {
  const extractor = getTextExtractor();

  // Provide the correct path to the .pptx file
  const filePath = path.resolve(
    "C:/Users/V/Downloads/First Semester/COSC 303 (Operating Systems II)/Course Slides/deadlocks.ppt"
  );

  // Extract text from the local file
  const text = await extractor.extractText({ input: filePath, type: "file" });

  console.log(text);
})();
