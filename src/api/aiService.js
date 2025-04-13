// src/api/aiService.js
export async function fetchAIResponse(userMessage, selectedModel = "gpt-3.5-turbo", tutor = "general") {
  try {
    const response = await fetch('http://51.21.106.225:5000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        model: selectedModel,
        tutor: tutor
      }),
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}