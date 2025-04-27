import React from 'react';

const ModelSelector = ({ selectedModel, onModelChange, tutor }) => {
  const getModelsForTutor = (tutorType) => {
    switch(tutorType) {
      case 'biology':
        return [
          { id: 'ft:gpt-3.5-turbo-0125:personal:csp-biology-finetuning-data10-20000:BJN7IqeS', name: 'Biology (Fine-tuned)' }
        ];
      case 'python':
        return [
          { id: 'ft:gpt-3.5-turbo-0125:personal:dr1-csv6-shortened-3381:B0DlvD7p', name: 'Python (Fine-tuned)' }
        ];
      default:
        return [
          { id: 'gpt-3.5-turbo', name: 'GPT-3.5' }
        ];
    }
  };

  const models = getModelsForTutor(tutor);

  React.useEffect(() => {
    const modelExists = models.some(m => m.id === selectedModel);
    if (!modelExists && models.length > 0) {
      onModelChange(models[0].id);
    }
  }, [tutor, selectedModel, models, onModelChange]);

  if (models.length === 1) {
    return (
      <div className="model-selector">
        <label>Model: {models[0].name}</label>
      </div>
    );
  }

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