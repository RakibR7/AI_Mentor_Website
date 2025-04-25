// src/pages/Chat.js
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { fetchAIResponse, API_BASE_URL } from "../api/aiService";
import ModelSelector from "../components/ModelSelector";
import TutorSelector from "../components/TutorSelector";
import "./Chat.css";

function Chat() {
  const location = useLocation();
  const initialTutor = location.state?.tutor || "biology";
  const initialModel = location.state?.selectedModel || "gpt-3.5-turbo";
  const initialConversationId = location.state?.conversationId || null;

  const [tutor, setTutor] = useState(initialTutor);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(initialConversationId);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      setIsFetching(true);
      console.log(`Fetching conversations for tutor: ${tutor} from ${API_BASE_URL}`);
      const response = await fetch(`${API_BASE_URL}/api/conversations?tutor=${tutor}`);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log(`Found ${data.length} conversations`);
      setConversations(data);

      // Only set active conversation if none is selected and data is available
      if (data.length > 0) {
        if (!activeConversationId) {
          setActiveConversationId(data[0]._id);
          console.log(`Set active conversation to: ${data[0]._id}`);
        }
      } else {
        setActiveConversationId(null);
        console.log("No conversations found, set active to null");
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      setError("Failed to load conversations. Please check your network connection and try again.");
    } finally {
      setIsFetching(false);
    }
  }, [tutor, activeConversationId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSend = async () => {
    if (!userInput.trim() || !activeConversationId || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Sending message to conversation: ${activeConversationId}`);
      const userResponse = await fetch(`${API_BASE_URL}/api/messages`, {
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

      if (!userResponse.ok) {
        throw new Error(`Failed to send user message: ${userResponse.status}`);
      }

      // Get AI response
      console.log("Getting AI response");
      const aiReply = await fetchAIResponse(userInput, selectedModel, tutor);

      // Save AI response
      console.log("Saving AI response");
      const aiResponse = await fetch(`${API_BASE_URL}/api/messages`, {
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

      if (!aiResponse.ok) {
        throw new Error(`Failed to save AI response: ${aiResponse.status}`);
      }

      console.log("Refreshing conversations");
      await fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send or receive messages. Please try again.");
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  // Allow sending message on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("Creating new conversation");

      const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Conversation",
          model: selectedModel,
          tutor: tutor
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const newConversation = await response.json();
      console.log(`Created conversation with ID: ${newConversation._id}`);

      setConversations([newConversation, ...conversations]);
      setActiveConversationId(newConversation._id);
    } catch (error) {
      console.error("Error creating conversation:", error);
      setError("Failed to create a new conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();

    try {
      setError(null);
      console.log(`Deleting conversation: ${id}`);

      const response = await fetch(`${API_BASE_URL}/api/conversations/${id}?tutor=${tutor}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const updatedConversations = conversations.filter((conv) => conv._id !== id);
      setConversations(updatedConversations);

      if (activeConversationId === id && updatedConversations.length > 0) {
        setActiveConversationId(updatedConversations[0]._id);
        console.log(`Set new active conversation to: ${updatedConversations[0]._id}`);
      } else if (updatedConversations.length === 0) {
        setActiveConversationId(null);
        console.log("No conversations left, set active to null");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      setError("Failed to delete conversation. Please try again.");
    }
  };

  const activeConversation = conversations.find((conv) => conv._id === activeConversationId);

  return (
    <div className="ChatContainer">
      <div className="Sidebar">
        <TutorSelector tutor={tutor} onTutorChange={setTutor} />
        <button
          className="NewConversationButton"
          onClick={handleNewConversation}
          disabled={isLoading || isFetching}
        >
          {isFetching ? "Loading..." : "+ New Conversation"}
        </button>
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          tutor={tutor}
        />
        {isFetching ? (
          <div className="LoadingIndicator">Loading conversations...</div>
        ) : (
          <ul className="ConversationList">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <li key={conv._id} className={conv._id === activeConversationId ? "active" : ""}>
                  <span onClick={() => setActiveConversationId(conv._id)}>
                    {conv.title ? conv.title : "Untitled Conversation"}
                  </span>
                  <button
                    className="DeleteButton"
                    onClick={(e) => handleDeleteConversation(conv._id, e)}
                    aria-label="Delete conversation"
                  >
                    X
                  </button>
                </li>
              ))
            ) : (
              <li className="NoConversations">No conversations yet</li>
            )}
          </ul>
        )}
      </div>
      <div className="ChatMain">
        {error && <div className="ErrorMessage">{error}</div>}
        <div className="Messages">
          {isFetching ? (
            <div className="LoadingMessages">Loading messages...</div>
          ) : activeConversation ? (
            activeConversation.messages && activeConversation.messages.length > 0 ? (
              activeConversation.messages.map((msg, index) => (
                <div key={index} className={msg.sender === "user" ? "userMsg" : "aiMsg"}>
                  <p>{msg.text}</p>
                </div>
              ))
            ) : (
              <p className="EmptyConversation">Start a conversation by typing a message below</p>
            )
          ) : (
            <p className="NoConversation">No conversation selected. Create a new one or select from the sidebar.</p>
          )}
        </div>
        <div className="InputArea">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your mentor..."
            disabled={isLoading || !activeConversationId || isFetching}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !userInput.trim() || !activeConversationId || isFetching}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;