// src/pages/Chat.js
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { fetchAIResponse } from "../api/aiService";
import ModelSelector from "../components/ModelSelector";
import TutorSelector from "../components/TutorSelector";
import "./Chat.css";

// Define API base URL - should match the one in aiService.js
const API_BASE_URL = 'http://51.21.106.225:5000';

function Chat() {
  const location = useLocation();
  const initialTutor = location.state?.tutor || "maths"; // default tutor
  const initialModel = location.state?.selectedModel || "gpt-3.5-turbo";
  const initialConversationId = location.state?.conversationId || null;

  const [tutor, setTutor] = useState(initialTutor);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(initialConversationId);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Updated fetchConversations with proper API URL
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/conversations?tutor=${tutor}`);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      setConversations(data);

      // Only set active conversation if none is selected and data is available
      if (data.length > 0) {
        if (!activeConversationId) {
          setActiveConversationId(data[0]._id);
        }
      } else {
        setActiveConversationId(null);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }, [tutor, activeConversationId]);

  useEffect(() => {
    fetchConversations();
    // Only clear active conversation when tutor changes
  }, [tutor, fetchConversations]);

  const handleSend = async () => {
    if (!userInput.trim() || !activeConversationId || isLoading) return;

    setIsLoading(true);

    try {
      // Save user message - updated URL
      await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversationId,
          sender: "user",
          text: userInput,
          model: selectedModel,
          tutor: tutor
        })
      });

      // Get AI response - uses fetchAIResponse which should be updated in aiService.js
      const aiReply = await fetchAIResponse(userInput, selectedModel, tutor);

      // Save AI response - updated URL
      await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversationId,
          sender: "ai",
          text: aiReply,
          model: selectedModel,
          tutor: tutor
        })
      });

      await fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  // Allow sending message on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleNewConversation = async () => {
    try {
      // Updated URL
      const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "",
          model: selectedModel,
          tutor: tutor
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const newConversation = await response.json();
      setConversations([newConversation, ...conversations]);
      setActiveConversationId(newConversation._id);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      // Updated URL
      await fetch(`${API_BASE_URL}/api/conversations/${id}?tutor=${tutor}`, {
        method: "DELETE"
      });

      const updatedConversations = conversations.filter((conv) => conv._id !== id);
      setConversations(updatedConversations);

      if (activeConversationId === id && updatedConversations.length > 0) {
        setActiveConversationId(updatedConversations[0]._id);
      } else if (updatedConversations.length === 0) {
        setActiveConversationId(null);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const activeConversation = conversations.find((conv) => conv._id === activeConversationId);

  return (
    <div className="ChatContainer">
      <div className="Sidebar">
        <TutorSelector tutor={tutor} onTutorChange={setTutor} />
        <button className="NewConversationButton" onClick={handleNewConversation}>
          + New Conversation
        </button>
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          tutor={tutor}
        />
        <ul className="ConversationList">
          {conversations.map((conv) => (
            <li key={conv._id} className={conv._id === activeConversationId ? "active" : ""}>
              <span onClick={() => setActiveConversationId(conv._id)}>
                {conv.title ? conv.title : "Untitled Conversation"}
              </span>
              <button className="DeleteButton" onClick={() => handleDeleteConversation(conv._id)}>
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="ChatMain">
        <div className="Messages">
          {activeConversation ? (
            activeConversation.messages.map((msg, index) => (
              <div key={index} className={msg.sender === "user" ? "userMsg" : "aiMsg"}>
                <p>{msg.text}</p>
              </div>
            ))
          ) : (
            <p>No conversation selected</p>
          )}
        </div>
        <div className="InputArea">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your mentor..."
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !userInput.trim()}>
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;