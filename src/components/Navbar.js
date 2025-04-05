import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="Navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/chat">Chat</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
        <Link to="/subject-tutor">Subject Tutor</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
