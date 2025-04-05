// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch'); // Ensure you're using node-fetch@2
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Conversation Schema (same for all tutors)
const conversationSchema = new mongoose.Schema({
  title: String,
  messages: [{
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  model: String,
  createdAt: { type: Date, default: Date.now }
});

// Helper: Get dynamic Conversation model for a given tutor
function getConversationModel(tutor) {
  const modelName = 'Conversation_' + tutor;
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }
  // Third parameter is the collection name
  return mongoose.model(modelName, conversationSchema, 'conversations_' + tutor);
}

// Middleware
app.use(express.json());
app.use(cors());

// GET all conversations for a specific tutor
app.get('/api/conversations', async (req, res) => {
  try {
    const tutor = req.query.tutor;
    if (!tutor) {
      return res.status(400).json({ error: 'Tutor query parameter is required' });
    }
    const ConversationModel = getConversationModel(tutor);
    const conversations = await ConversationModel.find().sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new conversation with tutor field
app.post('/api/conversations', async (req, res) => {
  try {
    const { title, model, tutor } = req.body;
    if (!tutor) {
      return res.status(400).json({ error: 'Tutor is required' });
    }
    const ConversationModel = getConversationModel(tutor);
    const newConversation = new ConversationModel({ title: title || "", model, messages: [] });
    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add message to conversation and update title on first user message
app.post('/api/messages', async (req, res) => {
  try {
    const { conversationId, sender, text, model, tutor } = req.body;
    if (!tutor) {
      return res.status(400).json({ error: 'Tutor is required' });
    }
    const ConversationModel = getConversationModel(tutor);
    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Update title on the first user message if not already set
    if (conversation.messages.length === 0 && sender === "user") {
      const newTitle = text.split(" ").slice(0, 5).join(" ");
      conversation.title = newTitle;
    }

    conversation.messages.push({ sender, text });
    conversation.model = model;
    await conversation.save();

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete conversation (tutor passed as query parameter)
app.delete('/api/conversations/:id', async (req, res) => {
  try {
    const tutor = req.query.tutor;
    if (!tutor) {
      return res.status(400).json({ error: 'Tutor query parameter is required' });
    }
    const ConversationModel = getConversationModel(tutor);
    const conversation = await ConversationModel.findByIdAndDelete(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// OpenAI endpoint (unchanged)
app.post('/api/openai', async (req, res) => {
  const { message, model } = req.body;

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
        model: model || "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 150
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return res.status(response.status).json({
        error: 'OpenAI API Error',
        details: data.error?.message || 'Unknown error'
      });
    }

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
