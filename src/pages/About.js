import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About Mentor AI</h1>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            AI Mentor is designed to provide personalized learning experiences through
            AI-driven tutoring across various subjects. We aim to make quality education
            accessible to everyone, anytime.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Tutors</h2>
          <p>
            We currently offer specialized AI tutors in:
          </p>
          <ul className="tutor-list">
            <li><strong>Biology</strong> - Expert in genetics, ecology, and physiology</li>
            <li><strong>Python</strong> - Programming tutor focused on teaching coding skills</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>How It Works</h2>
          <p>
            Simply select a tutor from the Subject Tutor screen, and start chatting.
            Ask questions, request explanations, or work through problems. Our AI will
            respond with helpful, educational content tailored to your learning level.
          </p>
        </div>
        <div className="about-section">
          <h2>Contact Us</h2>
          <p>
            For support, feedback, or inquiries, please email us at
            <a href="mailto:support@mentorai.example.com"> support@mentorai.example.com</a>
          </p>
        </div>
      </div>
      <div className="about-footer">
        <p>2025 AI Mentor Version 3.0</p>
      </div>
    </div>
  );
}

export default About;