// src/pages/SubjectTutor.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectTutor.css';

// src/pages/SubjectTutor.js
// In SubjectTutor.js, update the subjects array
const subjects = [
  {
    id: 'biology',
    name: 'Biology Tutor',
    model: 'ft:gpt-3.5-turbo-0125:personal:csp-biology-finetuning-data10-20000:BJN7IqeS'
  },
  {
    id: 'python',
    name: 'Python Tutor',
    model: 'ft:gpt-3.5-turbo-0125:personal:dr1-csv6-shortened-3381:B0DlvD7p'
  }
  // Removed math and English tutors to simplify
];

function SubjectTutor() {
  const navigate = useNavigate();

  const handleSelectSubject = async (subject) => {
    try {
      // Create a new conversation for the selected subject
      const response = await fetch('http://localhost:5000/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: subject.name, // initial title is the subject name
          model: subject.model,
          tutor: subject.id  // use subject id to route to the correct collection
        })
      });
      const newConversation = await response.json();

      // Navigate to the Chat page with the new conversation ID, tutor, and model info
      navigate('/chat', { state: { conversationId: newConversation._id, tutor: subject.id, selectedModel: subject.model } });
    } catch (error) {
      console.error('Error creating conversation for subject:', error);
    }
  };

  return (
    <div className="subject-tutor-container">
      <h2>Select a Subject Tutor</h2>
      <div className="subject-buttons">
        {subjects.map((subject) => (
          <button key={subject.id} onClick={() => handleSelectSubject(subject)}>
            {subject.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SubjectTutor;