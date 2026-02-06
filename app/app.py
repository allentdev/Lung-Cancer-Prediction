import streamlit as st
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model

# Load model
model = load_model("models/lung_cancer_cnn.h5")

st.title("🫁 Early Lung Cancer Detection System")

mode = st.radio(
    "Choose Input Mode",
    ("CT Scan Only", "Behavior Only", "CT Scan + Behavior")
)

st.subheader("Behavior Information")


uploaded_file = st.file_uploader("Upload Lung CT Image", type=["png", "jpg", "jpeg"])

smoking_years = st.slider("Smoking Years", 0, 40, 5)
cigarettes_per_day = st.slider("Cigarettes per Day", 0, 40, 5)
age = st.slider("Age", 18, 90, 40)
pollution_exposure = st.slider("Pollution Exposure (0–5)", 0, 5, 2)

ai_result = None
behavior_risk = None

# --- BEHAVIOR MODE ---
if mode in ["Behavior Only", "CT Scan + Behavior"]:
    behavior_score, behavior_risk = calculate_behavior_risk(
        smoking_years, cigarettes_per_day, age, pollution_exposure
    )
    st.subheader(f"Behavior Risk Level: {behavior_risk}")
    st.write(f"Behavior Risk Score: {behavior_score}")

# --- CT MODE ---
if mode in ["CT Scan Only", "CT Scan + Behavior"] and uploaded_file:

    file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img_input = np.expand_dims(img, axis=(0, -1))

    prediction = model.predict(img_input)[0][0]
    label = "Cancer Detected" if prediction >= 0.5 else "Normal"

    ai_result = {
        "label": label,
        "risk_level": "High" if prediction >= 0.5 else "Low",
        "confidence": round(float(prediction) * 100, 2)
    }

    st.image(img, caption="Uploaded CT Image", width=300)
    st.subheader(f"CT Prediction: {label}")
    st.subheader(f"Confidence: {ai_result['confidence']}%")

# --- COMBINED DECISION ---
if mode == "CT Scan + Behavior" and ai_result and behavior_risk:

    if ai_result["risk_level"] == "High" or behavior_risk == "High":
        final_risk = "High"
    elif behavior_risk == "Medium":
        final_risk = "Medium"
    else:
        final_risk = "Low"

    st.subheader(f"Final Combined Risk Level: {final_risk}")

    recommendations = generate_recommendations(ai_result, behavior_risk)

    st.subheader("Recommendations:")
    for rec in recommendations:
        st.write("•", rec)

# --- CT ONLY RECOMMENDATIONS ---
elif mode == "CT Scan Only" and ai_result:

    recommendations = generate_recommendations(ai_result, "Low")

    st.subheader("Recommendations:")
    for rec in recommendations:
        st.write("•", rec)

# --- BEHAVIOR ONLY RECOMMENDATIONS ---
elif mode == "Behavior Only" and behavior_risk:

    fake_ai_result = {"risk_level": behavior_risk}
    recommendations = generate_recommendations(fake_ai_result, behavior_risk)

    st.subheader("Recommendations:")
    for rec in recommendations:
        st.write("•", rec)
