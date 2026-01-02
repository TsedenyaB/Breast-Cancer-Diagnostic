import React from 'react';
import './BiomarkerInputs.css';

const biomarkerConfig = [
  { name: 'radius_mean', label: 'Radius Mean', min: 5, max: 30, step: 0.1 },
  { name: 'texture_mean', label: 'Texture Mean', min: 5, max: 40, step: 0.1 },
  { name: 'perimeter_mean', label: 'Perimeter Mean', min: 40, max: 200, step: 1 },
  { name: 'area_mean', label: 'Area Mean', min: 200, max: 2500, step: 1 },
  { name: 'smoothness_mean', label: 'Smoothness Mean', min: 0.05, max: 0.2, step: 0.001 },
  { name: 'compactness_mean', label: 'Compactness Mean', min: 0.01, max: 0.4, step: 0.001 },
  { name: 'concavity_mean', label: 'Concavity Mean', min: 0.0, max: 0.5, step: 0.001 },
  { name: 'concave_points_mean', label: 'Concave Points Mean', min: 0.0, max: 0.2, step: 0.001 },
  { name: 'symmetry_mean', label: 'Symmetry Mean', min: 0.1, max: 0.4, step: 0.001 },
  { name: 'fractal_dim_mean', label: 'Fractal Dim Mean', min: 0.05, max: 0.1, step: 0.001 },
];

const BiomarkerInputs = ({ biomarkers, onBiomarkerChange, onAnalyze, loading }) => {
  return (
    <div className="biomarker-inputs">
      <div className="header">
        <span className="icon">🩺</span>
        <h2>Input Biomarkers</h2>
      </div>
      
      <div className="biomarker-list">
        {biomarkerConfig.map((config) => (
          <div key={config.name} className="biomarker-item">
            <label className="biomarker-label">{config.label}</label>
            <div className="slider-container">
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={config.step}
                value={biomarkers[config.name]}
                onChange={(e) => onBiomarkerChange(config.name, e.target.value)}
                className="slider"
              />
              <span className="biomarker-value">
                {biomarkers[config.name].toFixed(3)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="analyze-button" 
        onClick={onAnalyze}
        disabled={loading}
      >
        <span className="button-icon">✏️</span>
        {loading ? 'Analyzing...' : 'Analyze Results'}
      </button>
    </div>
  );
};

export default BiomarkerInputs;

