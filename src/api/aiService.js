// src/api/aiService.js
export async function fetchAIResponse(userMessage, selectedModel = "gpt-3.5-turbo") {
  try {
    const response = await fetch('http://localhost:5000/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, model: selectedModel }),
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}
