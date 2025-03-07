const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Endpoint to interact with OpenAI API
app.post('/api/openai', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 150
      })
    });

    const data = await response.json();

    // Check if the OpenAI API response is valid
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return res.status(response.status).json({ 
        error: 'OpenAI API Error',
        details: data.error?.message || 'Unknown error'
      });
    }

    // Validate the response structure
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Unexpected API response:', data);
      return res.status(500).json({ 
        error: 'Unexpected response structure from OpenAI' 
      });
    }

    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ 
      error: 'Error communicating with OpenAI',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});