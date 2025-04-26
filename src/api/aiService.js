export const API_BASE_URL = 'https://api.teachmetutor.academy';

export async function fetchAIResponse(userMessage, selectedModel = "gpt-3.5-turbo", tutor = "general") {
  try {
    const response = await fetch(`${API_BASE_URL}/api/openai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        model: selectedModel,
        tutor: tutor
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}