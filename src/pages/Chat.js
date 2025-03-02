// src/pages/Chat.js
import React, { useState } from "react";
import { fetchAIResponse } from "../api/aiService";
import "./Chat.css";

function Chat() {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // Add user's message to conversation
    setConversation((prev) => [...prev, { sender: "user", text: userInput }]);

    // Clear input field
    const input = userInput;
    setUserInput("");

    // Get AI response
    try {
      const aiReply = await fetchAIResponse(input);
      setConversation((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (error) {
      setConversation((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong. Please try again." }
      ]);
    }
  };

  return (
    <div className="ChatPage">
      <div className="Conversation">
        {conversation.map((msg, index) => (
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
  );
}

export default Chat;

