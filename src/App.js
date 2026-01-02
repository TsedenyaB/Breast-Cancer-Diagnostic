import React, { useState } from 'react';
import './App.css';
import BiomarkerInputs from './components/BiomarkerInputs';
import ModelOutputs from './components/ModelOutputs';
import axios from 'axios';

function App() {
  const [biomarkers, setBiomarkers] = useState({
    radius_mean: 14.4,
    texture_mean: 26.4,
    perimeter_mean: 71,
    area_mean: 836,
    smoothness_mean: 0.126,
    compactness_mean: 0.155,
    concavity_mean: 0.257,
    concave_points_mean: 0.048,
    symmetry_mean: 0.206,
    fractal_dim_mean: 0.062,
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBiomarkerChange = (name, value) => {
    setBiomarkers(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/predict/', biomarkers);
      setResults(response.data);
    } catch (error) {
      console.error('Error predicting:', error);
      alert('Error making prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="left-panel">
          <BiomarkerInputs
            biomarkers={biomarkers}
            onBiomarkerChange={handleBiomarkerChange}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        </div>
        <div className="right-panel">
          <ModelOutputs results={results} />
        </div>
      </div>
    </div>
  );
}

export default App;

