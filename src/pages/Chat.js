// src/pages/Chat.js
import React, { useState, useEffect } from "react";
import { fetchAIResponse } from "../api/aiService";
import ModelSelector from "../components/ModelSelector";
import "./Chat.css";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");

  // Load conversations from backend on component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/conversations');
        const data = await response.json();
        setConversations(data);
        if (data.length > 0) {
          setActiveConversationId(data[0]._id);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    };
    loadConversations();
  }, []);

  const handleSend = async () => {
    if (!userInput.trim() || !activeConversationId) return;

    try {
      // Save user message
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversationId,
          sender: "user",
          text: userInput,
          model: selectedModel
        })
      });

      // Get AI response (pass selected model as needed)
      const aiReply = await fetchAIResponse(userInput, selectedModel);

      // Save AI response
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversationId,
          sender: "ai",
          text: aiReply,
          model: selectedModel
        })
      });

      // Refresh conversations from the backend
      const response = await fetch('http://localhost:5000/api/conversations');
      const updatedConversations = await response.json();
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Error:", error);
    }

    setUserInput("");
  };

  const handleNewConversation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: "New Conversation",
          model: selectedModel
        })
      });

      const newConversation = await response.json();
      setConversations([newConversation, ...conversations]);
      setActiveConversationId(newConversation._id);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  // Find the active conversation object
  const activeConversation = conversations.find(conv => conv._id === activeConversationId);

  return (
    <div className="ChatContainer">
      <div className="Sidebar">
        <button className="NewConversationButton" onClick={handleNewConversation}>
          + New Conversation
        </button>
        <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
        <ul className="ConversationList">
          {conversations.map((conv) => (
            <li
              key={conv._id}
              className={conv._id === activeConversationId ? "active" : ""}
              onClick={() => setActiveConversationId(conv._id)}
            >
              {conv.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="ChatMain">
        <div className="Messages">
          {activeConversation &&
            activeConversation.messages.map((msg, index) => (
              <div key={index} className={msg.sender === "user" ? "userMsg" : "aiMsg"}>
                <p>{msg.text}</p>
              </div>
            ))}
        </div>
        <div className="InputArea">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask your mentor..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
