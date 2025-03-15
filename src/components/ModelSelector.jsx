// src/components/ModelSelector.js
import React from 'react';

const ModelSelector = ({ selectedModel, onModelChange }) => {
  const models = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5' },
    { id: 'gpt-4', name: 'GPT-4' }
  ];

  return (
    <div className="model-selector">
      <label>Model:</label>
      <select value={selectedModel} onChange={(e) => onModelChange(e.target.value)}>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
