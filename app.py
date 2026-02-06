import streamlit as st
import numpy as np
from src.utils import calculate_behavior_risk, generate_recommendations
from src.model import load_cancer_model, predict_image

# --- Page Configuration ---
st.set_page_config(
    page_title="Early Lung Cancer Detection",
    page_icon="🫁",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Custom CSS for Professional Styling ---
st.markdown("""
    <style>
    .main {
        background-color: #f8f9fa;
    }
    h1 {
        color: #2c3e50;
        font-family: 'Helvetica Neue', sans-serif;
    }
    h2, h3 {
        color: #34495e;
        font-family: 'Helvetica Neue', sans-serif;
    }
    .stButton>button {
        background-color: #2ecc71;
        color: white;
        border-radius: 8px;
        border: none;
        padding: 10px 24px;
        font-size: 16px;
    }
    .stButton>button:hover {
        background-color: #27ae60;
    }
    div.stMetric {
        padding: 15px;
        border-radius: 10px;
        border: 1px solid rgba(128, 128, 128, 0.2);
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .stAlert {
        border-radius: 8px;
    }
    </style>
    """, unsafe_allow_html=True)

# --- Sidebar: Optimization & Inputs ---
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/2966/2966486.png", width=100)
    st.title("Detection System")
    st.markdown("---")
    
    st.subheader("⚙️ Analysis Modules")
    
    # Custom styling for checkboxes to look like cards
    st.markdown("""
    <style>
    /* Style for the first checkbox container (CT Scan) */
    div[data-testid="stCheckbox"]:nth-of-type(1) {
        background-color: #e3f2fd; /* Light Blue */
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #bbdefb;
        margin-bottom: 10px;
    }
    div[data-testid="stCheckbox"]:nth-of-type(1) label span p {
        color: black !important;
        font-weight: 500;
    }
    /* Style for the second checkbox container (Behavior) */
    div[data-testid="stCheckbox"]:nth-of-type(2) {
        background-color: #f1f8e9; /* Light Green */
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #dcedc8;
        margin-bottom: 10px;
    }
    div[data-testid="stCheckbox"]:nth-of-type(2) label span p {
        color: black !important;
        font-weight: 500;
    }
    </style>
    """, unsafe_allow_html=True)
    
    enable_ct = st.checkbox("CT Scan Analysis", value=True)
    enable_behavior = st.checkbox("Behavior Analysis", value=True)
    
    st.markdown("---")
    
    # Behavior Inputs
    if enable_behavior:
        st.header("📝 Patient Data")
        smoking_years = st.slider("Years of Smoking", 0, 50, 5)
        cigarettes_per_day = st.slider("Cigarettes per Day", 0, 50, 5)
        age = st.slider("Age", 18, 100, 40)
        pollution_exposure = st.select_slider(
            "Pollution Exposure",
            options=[0, 1, 2, 3, 4, 5],
            value=2,
            help="0 = None, 5 = Extreme"
        )
    
    # About Section
    st.markdown("---")
    with st.expander("ℹ️ About the Model"):
        st.caption("""
            This system uses a Convolutional Neural Network (CNN) trained on lung CT scans 
            combined with a heuristic risk assessment model based on lifestyle factors.
        """)

# --- Main Content Area ---

st.title("🫁 Early Lung Cancer Detection System")
st.markdown("""
    Welcome to the advanced lung cancer screening tool. Please upload a CT scan or provide patient details 
    to assess the risk profile using our AI-driven analysis.
""")
st.divider()

# Load Model
model = load_cancer_model()

ai_result = None
behavior_risk = None
behavior_score = 0
uploaded_file = None

# --- DATA PROCESSING ---

col1, col2 = st.columns([1, 1.5])

with col1:
    # Image Upload Section
    if enable_ct:
        st.subheader("📷 Upload CT Scan")
        uploaded_file = st.file_uploader("", type=["png", "jpg", "jpeg"])
        
        if uploaded_file and model:
            # Read file safely
            file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
            
            # Predict
            with st.spinner("Analyzing CT Scan..."):
                ai_result = predict_image(model, file_bytes)
            
            st.success("Analysis Complete")
            st.image(ai_result["original_image"], caption="Processed CT Scan", width=350)
    elif not enable_behavior:
        st.info("👈 Please select at least one analysis module from the sidebar.")

# --- RESULTS DISPLAY ---

with col2:
    st.subheader("📊 Analysis Results")

    if not (enable_ct or enable_behavior):
        st.warning("No analysis modules selected.")
        st.stop()

    # Behavior Analysis Calculation
    if enable_behavior:
        behavior_score, behavior_risk = calculate_behavior_risk(
            smoking_years, cigarettes_per_day, age, pollution_exposure
        )

    # 1. CT Results
    if enable_ct and ai_result:
        st.markdown("#### AI Image Analysis")
        c1, c2 = st.columns(2)
        c1.metric("Prediction", ai_result['label'])
        c2.metric("Confidence", f"{ai_result['confidence']}%")
        
        if ai_result['risk_level'] == "High":
            st.error(f"AI Risk Level: {ai_result['risk_level']}")
        else:
            st.success(f"AI Risk Level: {ai_result['risk_level']}")
        
        st.divider()

    # 2. Behavior Results
    if enable_behavior and behavior_risk:
        st.markdown("#### Lifestyle Risk Assessment")
        c3, c4 = st.columns(2)
        c3.metric("Risk Score", behavior_score)
        c4.metric("Risk Level", behavior_risk, delta_color="inverse")
        
        st.progress(min(behavior_score / 150, 1.0)) # Normalize score roughly
        st.caption("Calculated based on smoking history, age, and environmental factors.")
        st.divider()

    # 3. Final Combined Logic & Recommendations
    final_recommendations = []
    
    if enable_ct and enable_behavior:
        if ai_result and behavior_risk:
            st.markdown("### 🏥 Comprehensive Diagnosis")
            if ai_result["risk_level"] == "High" or behavior_risk == "High":
                st.warning("Overall Risk Status: **HIGH**")
            elif behavior_risk == "Medium":
                st.info("Overall Risk Status: **MODERATE**")
            else:
                st.success("Overall Risk Status: **LOW**")
                
            final_recommendations = generate_recommendations(ai_result, behavior_risk)
        elif not ai_result:
            # Waiting for image
            st.info("Please upload a CT scan to see combined results.")
            final_recommendations = generate_recommendations(None, behavior_risk)

    elif enable_ct and ai_result:
        final_recommendations = generate_recommendations(ai_result, "Low") # Default low behavior for CT only

    elif enable_behavior and behavior_risk:
        final_recommendations = generate_recommendations(None, behavior_risk)

    # Display Recommendations
    if final_recommendations:
        st.subheader("💡 Medical Recommendations")
        for rec in final_recommendations:
            st.info(f"• {rec}")

