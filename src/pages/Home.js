// src/pages/Home.js
import React from "react"
import { useNavigate } from "react-router-dom"
import "./Home.css"

function Home() {
  const navigate = useNavigate()

  const handleExploreTutors = () => {
    navigate("/subject-tutor")
  }

  return (
    <div className="HomePage">
      <h1>Mentor AI</h1>
      <h2>Empowering Your Learning Journey</h2>
      <p>Experience interactive tutoring in Biology, Math, and English through our AI-driven platform.</p>
      <p>Get instant feedback, explanations, and guidance — all tailored to your needs.</p>
      <button onClick={handleExploreTutors}>Explore Tutors</button>
    </div>
  )
}

export default Home
