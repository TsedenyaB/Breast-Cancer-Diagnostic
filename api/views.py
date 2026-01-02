import os
import pickle
import numpy as np
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

try:
    import joblib
    JOBLIB_AVAILABLE = True
except ImportError:
    JOBLIB_AVAILABLE = False

_models_cache = {
    'scaler': None,
    'logistic_model': None,
    'decision_tree_model': None,
    'loaded': False
}

def load_models():
    if _models_cache['loaded']:
        return (
            _models_cache['scaler'],
            _models_cache['logistic_model'],
            _models_cache['decision_tree_model']
        )
    
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MODELS_DIR = os.path.join(BASE_DIR, 'ml_models')
    
    try:
        scaler_path = os.path.join(MODELS_DIR, 'scaler.pkl')
        logistic_path = os.path.join(MODELS_DIR, 'logistic_model.pkl')
        tree_path = os.path.join(MODELS_DIR, 'decision_tree_model.pkl')
        
        if JOBLIB_AVAILABLE:
            _models_cache['scaler'] = joblib.load(scaler_path)
            _models_cache['logistic_model'] = joblib.load(logistic_path)
            _models_cache['decision_tree_model'] = joblib.load(tree_path)
        else:
            with open(scaler_path, 'rb') as f:
                _models_cache['scaler'] = pickle.load(f)
            with open(logistic_path, 'rb') as f:
                _models_cache['logistic_model'] = pickle.load(f)
            with open(tree_path, 'rb') as f:
                _models_cache['decision_tree_model'] = pickle.load(f)
        
        _models_cache['loaded'] = True
    except Exception as e:
        print(f"Error loading models: {e}")
        _models_cache['loaded'] = True
    
    return (
        _models_cache['scaler'],
        _models_cache['logistic_model'],
        _models_cache['decision_tree_model']
    )


@api_view(['POST'])
def predict(request):
    scaler, logistic_model, decision_tree_model = load_models()
    
    if scaler is None or logistic_model is None or decision_tree_model is None:
        return Response(
            {'error': 'Models not loaded properly'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    try:
        biomarkers = [
            request.data.get('radius_mean'),
            request.data.get('texture_mean'),
            request.data.get('perimeter_mean'),
            request.data.get('area_mean'),
            request.data.get('smoothness_mean'),
            request.data.get('compactness_mean'),
            request.data.get('concavity_mean'),
            request.data.get('concave_points_mean'),
            request.data.get('symmetry_mean'),
            request.data.get('fractal_dim_mean'),
        ]
        
        if None in biomarkers:
            return Response(
                {'error': 'Missing biomarker values'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        features = np.array(biomarkers).reshape(1, -1)
        features_scaled = scaler.transform(features)
        
        logistic_prediction = logistic_model.predict(features_scaled)[0]
        decision_tree_prediction = decision_tree_model.predict(features_scaled)[0]
        
        logistic_proba = logistic_model.predict_proba(features_scaled)[0]
        decision_tree_proba = decision_tree_model.predict_proba(features_scaled)[0]
        
        logistic_confidence = max(logistic_proba) * 100
        decision_tree_confidence = max(decision_tree_proba) * 100
        
        return Response({
            'logistic_regression': {
                'prediction': int(logistic_prediction),
                'confidence': round(logistic_confidence, 1)
            },
            'decision_tree': {
                'prediction': int(decision_tree_prediction),
                'confidence': round(decision_tree_confidence, 1)
            }
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

