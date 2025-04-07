// src/components/TutorSelector.js
import React from "react";

const TutorSelector = ({ tutor, onTutorChange }) => {
  const subjects = [
    { id: "biology", name: "Biology" },
    { id: "python", name: "Python" }
    // Removed math and English to match SubjectTutor
  ];

  return (
    <div className="tutor-selector">
      <label>Select Tutor: </label>
      <select value={tutor} onChange={(e) => onTutorChange(e.target.value)}>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TutorSelector;