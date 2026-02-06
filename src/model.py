import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import streamlit as st
import os

@st.cache_resource
def load_cancer_model(model_path="models/lung_cancer_cnn.h5"):
    """
    Loads the trained Keras model.
    Uses st.cache_resource to optimize reloading.
    """
    if not os.path.exists(model_path):
        st.error(f"Model file not found at: {model_path}")
        return None
    
    try:
        model = load_model(model_path, compile=False)
        return model
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None

def predict_image(model, img_array):
    """
    Preprocesses the image and runs prediction using the loaded model.
    """
    # Preprocess
    img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img_input = np.expand_dims(img, axis=(0, -1))

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
