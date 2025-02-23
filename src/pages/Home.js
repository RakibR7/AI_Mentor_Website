import React, { useState } from "react";
import "./Page.css";

function Home() {
  const [message, setMessage] = useState("Welcome to Mentor AI");

  return (
    <div className="Page">
      <h1>{message}</h1>
      <p>Your personal AI mentor at your service.</p>
    </div>
  );
}

export default Home;
