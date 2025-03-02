// src/api/aiService.js
export async function fetchAIResponse(userMessage) {
  try {
    const response = await fetch('https://api.your-ai-service.com/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}
