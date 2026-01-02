import React from 'react';
import './ModelOutputs.css';

const ModelOutputs = ({ results }) => {
  if (!results) {
    return (
      <div className="model-outputs-placeholder">
        <p>Adjust biomarkers and click "Analyze Results" to see predictions</p>
      </div>
    );
  }

  const logisticResult = results.logistic_regression;
  const decisionTreeResult = results.decision_tree;

  return (
    <div className="model-outputs">
      <ModelCard
        title="Logistic Regression"
        prediction={logisticResult.prediction}
        confidence={logisticResult.confidence}
      />
      <ModelCard
        title="Decision Tree"
        prediction={decisionTreeResult.prediction}
        confidence={decisionTreeResult.confidence}
      />
    </div>
  );
};

const ModelCard = ({ title, prediction, confidence }) => {
  const isBenign = prediction === 0;
  const circleColor = isBenign ? '#4caf50' : '#f44336';

  return (
    <div className="model-card">
      <h3 className="model-title">{title}</h3>
      <div className="model-content">
        <div className="prediction-indicator">
          <div 
            className="prediction-circle" 
            style={{ backgroundColor: circleColor }}
          >
            {prediction}
          </div>
        </div>
        <div className="confidence-section">
          <div className="confidence-bar-container">
            <div 
              className="confidence-bar"
              style={{ 
                width: `${confidence}%`,
                backgroundColor: circleColor
              }}
            />
          </div>
          <div className="confidence-text">{confidence}%</div>
        </div>
      </div>
    </div>
  );
};

export default ModelOutputs;