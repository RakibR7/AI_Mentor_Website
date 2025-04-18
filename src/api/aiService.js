// src/api/aiService.js
const BASE_URL = process.env.REACT_APP_API_URL || "http://51.21.106.225:5000";

export const fetchAIResponse = async (message, model, tutor) => {
  try {
    const response = await fetch(`${BASE_URL}/api/openai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, model, tutor })
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Sorry, I couldn't get a response.";
  }
};
