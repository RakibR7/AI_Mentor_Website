import React from "react"
import { useNavigate } from "react-router-dom"
import "./Home.css"

function Home() {
  const navigate = useNavigate()

  // Navigate to /subject-tutor when button is clicked
  const handleExploreTutors = () => {
    navigate("/subject-tutor")
  }

  return (
    <div className="HomePage">
      <h1>Mentor AI</h1>
      <h2>Empowering Your Learning Journey</h2>
      <p>Experience interactive tutoring through our AI-driven platform.</p>

      {/* Button triggers navigation */}
      <button onClick={handleExploreTutors}>Explore Tutors</button>

      {/* Credits in bottom-right corner */}
      <div className="credit-homepage">
        Ocean - Photo by Engin Akyurt from{" "}
        <a
          href="https://www.pexels.com/photo/close-up-photo-of-blue-body-of-water-1435752/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pexels
        </a>
      </div>
    </div>
  )
}

export default Home
