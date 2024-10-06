const {
  GoogleAIFileManager,
  FileState,
} = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fileManager = new GoogleAIFileManager(process.env.API_KEY);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Controller to handle audio upload and processing
exports.uploadAudio = async (req, res) => {
  try {
    // Ensure file is an mp3
    if (!req.file) {
      return res.status(400).json({ error: "Only .mp3 files are accepted" });
    }

    // Upload the file to Google Gemini API
    const uploadResult = await fileManager.uploadFile(req.file.path, {
      mimeType: "audio/mp3",
      displayName: req.file.originalname,
    });

    let file = await fileManager.getFile(uploadResult.file.name);

    // Wait until the file is processed
    while (file.state === FileState.PROCESSING) {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Audio processing failed.");
    }

    // Log uploaded file's URI
    console.log(`Uploaded file as: ${uploadResult.file.uri}`);

    // Generate content based on the audio file
    const result = await genAI
      .getGenerativeModel({ model: "gemini-1.5-flash" })
      .generateContent([
        "Tell me about this audio clip.",
        {
          fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: "audio/mp3",
          },
        },
      ]);

    // Return the AI response
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};
