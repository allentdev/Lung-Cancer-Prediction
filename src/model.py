import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import os

def load_cancer_model(model_path="models/resnet_lung_cancer.h5"):
    """
    Loads the trained Keras model.
    """
    if not os.path.exists(model_path):
        print(f"Model file not found at: {model_path}")
        return None
    
    try:
        model = load_model(model_path, compile=False)
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def predict_image(model, img_array):
    """
    Preprocesses the image and runs prediction using the loaded model.
    """
    # Preprocess
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR) # Read as RGB (or BGR in OpenCV, need to convert)
    img = cv2.resize(img, (224, 224))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) # Convert BGR to RGB
    img = img / 255.0 # Normalize to [0, 1]
    img_input = np.expand_dims(img, axis=0) # Add batch dimension

    # Predict
    prediction = model.predict(img_input)[0][0]
    
    # Interpret
    # Assuming the model outputs probability of Cancer (1) vs Normal (0)
    label = "Cancer Detected" if prediction >= 0.5 else "Normal"
    risk_level = "High" if prediction >= 0.5 else "Low"
    confidence = round(float(prediction) * 100, 2)
    
    # If prediction is 'Normal', confidence of being normal is 1 - prob
    if label == "Normal":
        confidence = round((1 - float(prediction)) * 100, 2)

    return {
        "label": label,
        "risk_level": risk_level,
        "confidence": confidence,
        "original_image": img
    }
