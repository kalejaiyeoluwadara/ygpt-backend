const {
  GoogleGenerativeAI,
  GenerativeModel,
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAWBO048BkNduNdzX-vRZqIUpWYoAc1cFY");

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = "Hi there";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
