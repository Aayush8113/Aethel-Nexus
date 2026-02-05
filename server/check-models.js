require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function checkAvailableModels() {
  console.log("🔍 Asking Google for available models...");
  
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API ERROR:", data.error.message);
      return;
    }

    if (!data.models) {
      console.log("⚠️ No models found. Your API Key might need the 'Generative Language API' enabled.");
      return;
    }

    console.log("\n✅ SUCCESS! Your key has access to:");
    data.models.forEach(model => {
      // We only care about models that support 'generateContent'
      if (model.supportedGenerationMethods.includes("generateContent")) {
        console.log(`   - ${model.name.replace("models/", "")}`);
      }
    });

    console.log("\n👉 Please pick one of the names above for your chatController.js");

  } catch (error) {
    console.error("❌ NETWORK ERROR:", error.message);
  }
}

checkAvailableModels();