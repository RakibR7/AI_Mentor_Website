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
      <h1>AI Mentor</h1>
      <h2>Empowering Your Learning Journey</h2>
      <p>Experience interactive tutoring through our AI-driven platform.</p>

      <div className="button-borders">
        <button className="primary-button" onClick={handleExploreTutors}>
          Explore Tutors
        </button>
      </div>

      <div className="credit-homepage">
        Ocean - Photo by Engin Akyurt from <a href="https://www.pexels.com/photo/close-up-photo-of-blue-body-of-water-1435752/" target="_blank" rel="noopener noreferrer">Pexels</a>
      </div>
    </div>
  )
}

export default Home