// src/pages/Home.js
import React, { useState } from "react";
import "./Chat.css"; // Using Chat.css for page styling; you can create a separate Home.css if preferred

function Home() {
  const [message] = useState("Welcome to Mentor AI");

  return (
    <div className="Page">
      <h1>{message}</h1>
      <p>Your personal AI mentor at your service.</p>
    </div>
  );
}

export default Home;

