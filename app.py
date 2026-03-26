from flask import Flask, render_template, request, jsonify
import numpy as np
from src.utils import calculate_behavior_risk, generate_recommendations
from src.model import load_cancer_model, predict_image
import os
import pickle
import numpy as np

app = Flask(__name__, static_folder='frontend/dist/assets', static_url_path='/assets', template_folder='frontend/dist')

# Load Models
image_model = load_cancer_model()
try:
    with open('models/behavior_model.pkl', 'rb') as f:
        behavior_model = pickle.load(f)
except Exception as e:
    print(f"Error loading behavior model: {e}")
    behavior_model = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict_ct():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Read file into numpy array
        filestr = file.read()
        npimg = np.frombuffer(filestr, np.uint8)
        
        # Predict
        result = predict_image(image_model, npimg)
        
        # Get recommendations
        # Note: predict_image returns a dict including 'original_image' which is a numpy array.
        # We cannot JSON serialize numpy arrays easily, so we remove it for the API response.
        
        response_data = {
            'label': result['label'],
            'risk_level': result['risk_level'],
            'confidence': result['confidence']
        }
        
        recs = generate_recommendations(result, "Low") # Default low behavior for CT only
        response_data['recommendations'] = recs
        
        return jsonify(response_data)

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/risk', methods=['POST'])
def calculate_risk():
    data = request.json
    try:
        smoking = int(data.get('smoking_years', 0))
        cigs = int(data.get('cigarettes_per_day', 0))
        age = int(data.get('age', 0))
        pollution = int(data.get('pollution_exposure', 0))

        score, risk = calculate_behavior_risk(smoking, cigs, age, pollution)
        
        recs = generate_recommendations(None, risk)
        
        return jsonify({
            'score': score,
            'risk': risk,
            'recommendations': recs
        })
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/comprehensive', methods=['POST'])
def comprehensive_analysis():
    # Handle composite request (File + Form Data)
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})
    
    try:
        # 1. CT Analysis
        file = request.files['file']
        file_bytes = np.frombuffer(file.read(), np.uint8)
        ai_result = predict_image(model, file_bytes)
        
        # 2. Lifestyle Analysis
        smoking = int(request.form.get('smoking_years', 0))
        cigs = int(request.form.get('cigarettes_per_day', 0))
        age = int(request.form.get('age', 0))
        pollution = int(request.form.get('pollution_exposure', 0))
        
        score, risk = calculate_behavior_risk(smoking, cigs, age, pollution)
        
        # 3. Overall Logic
        overall = "High" if (ai_result['risk_level'] == "High" or risk == "High") else "Low"
        if risk == "Medium" and overall == "Low": overall = "Moderate"
        
        recs = generate_recommendations(ai_result, risk)
        
        return jsonify({
            'ct_risk': ai_result['risk_level'],
            'ct_conf': ai_result['confidence'],
            'lifestyle_risk': risk,
            'lifestyle_score': score,
            'overall_risk': overall,
            'recommendations': recs
        })

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)})

@app.route('/api/predict_behavior', methods=['POST'])
def predict_behavior():
    if not behavior_model:
        return jsonify({'error': 'Behavior model not loaded'}), 500
    
    try:
        data = request.json
        # Expected keys matching training columns
        input_data = [
            int(data.get('gender', 0)),
            int(data.get('age', 0)),
            int(data.get('smoking', 1)), 
            int(data.get('yellow_fingers', 1)),
            int(data.get('anxiety', 1)),
            int(data.get('peer_pressure', 1)),
            int(data.get('chronic_disease', 1)),
            int(data.get('fatigue', 1)),
            int(data.get('allergy', 1)),
            int(data.get('wheezing', 1)),
            int(data.get('alcohol', 1)),
            int(data.get('coughing', 1)),
            int(data.get('shortness_breath', 1)),
            int(data.get('swallowing_difficulty', 1)),
            int(data.get('chest_pain', 1))
        ]
        
        input_array = np.array([input_data])
        prediction = behavior_model.predict(input_array)[0]
        probability = behavior_model.predict_proba(input_array)[0][1]
        
        result = {
            'label': 'High Risk' if prediction == 1 else 'Low Risk',
            'probability': round(float(probability) * 100, 2),
            'risk_level': 'High' if probability > 0.5 else 'Low'
        }
        
        return jsonify(result)

    except Exception as e:
        print(f"Error in behavior prediction: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
