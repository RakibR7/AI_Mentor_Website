import React, { useState, useEffect } from "react";
import { fetchAIResponse } from "../api/aiService";
import "./Chat.css";

function Chat() {
  // conversations: an array of conversation objects { id, title, messages }
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [userInput, setUserInput] = useState("");

  // Load conversation threads from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("chatConversations");
    if (stored) {
      const parsed = JSON.parse(stored);
      setConversations(parsed);
      if (parsed.length > 0) {
        setActiveConversationId(parsed[0].id);
      }
    } else {
      // Create an initial conversation if none exist
      const newConversation = {
        id: Date.now().toString(),
        title: "New Conversation",
        messages: []
      };
      setConversations([newConversation]);
      setActiveConversationId(newConversation.id);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatConversations", JSON.stringify(conversations));
  }, [conversations]);

  // Get the active conversation object
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const handleSend = async () => {
    if (!userInput.trim() || !activeConversation) return;

    // Append the user's message to the active conversation
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, { sender: "user", text: userInput }]
        };
      }
      return conv;
    });
    setConversations(updatedConversations);

    const input = userInput;
    setUserInput("");

    try {
      const aiReply = await fetchAIResponse(input);
      // Optionally, update the conversation title with the first user message
      const newTitle =
        activeConversation.messages.length === 0 ? input : activeConversation.title;
      const updatedConversations2 = updatedConversations.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            title: newTitle,
            messages: [...conv.messages, { sender: "ai", text: aiReply }]
          };
        }
        return conv;
      });
      setConversations(updatedConversations2);
    } catch (error) {
      const updatedConversations3 = updatedConversations.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              { sender: "ai", text: "Sorry, something went wrong. Please try again." }
            ]
          };
        }
        return conv;
      });
      setConversations(updatedConversations3);
    }
  };

  const handleNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: []
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
  };

  return (
    <div className="ChatContainer">
      <div className="Sidebar">
        <button className="NewConversationButton" onClick={handleNewConversation}>
          + New Conversation
        </button>
        <ul className="ConversationList">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className={conv.id === activeConversationId ? "active" : ""}
              onClick={() => handleSelectConversation(conv.id)}
            >
              {conv.title.length > 20 ? conv.title.substring(0, 20) + "..." : conv.title}
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
