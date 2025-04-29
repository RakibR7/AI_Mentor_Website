import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectTutor.css';

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
]

function SubjectTutor() {
  const navigate = useNavigate();

  const handleSelectSubject = async (subject) => {
    try {
      const response = await fetch('https://api.teachmetutor.academy/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: subject.name,
          model: subject.model,
          tutor: subject.id
        })
      })
      const newConversation = await response.json();

      navigate('/chat', { state: { conversationId: newConversation._id, tutor: subject.id, selectedModel: subject.model } });
    } catch (error) {
      console.error('Error creating conversation for subject:', error);
    }
  }

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
  )
}

export default SubjectTutor;