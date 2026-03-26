
import os
import sys
import numpy as np
import cv2

# Add project root to path
sys.path.append(os.getcwd())

from src.model import load_cancer_model, predict_image

def verify():
    print("Loading model...")
    model = load_cancer_model()
    if model is None:
        print("Failed to load model.")
        return

    print("Model loaded successfully.")
    
    # Find a test image
    test_dir = 'data/images/LungcancerDataSet/Data/test'
    # Try to find a malignant case
    mal_dir = os.path.join(test_dir, 'MalignantCases')
    if not os.path.exists(mal_dir):
         # Try alternative name if my previous listing was wrong or changed
         mal_dir = os.path.join(test_dir, 'Malignant cases')
    
    image_path = None
    if os.path.exists(mal_dir) and len(os.listdir(mal_dir)) > 0:
        image_path = os.path.join(mal_dir, os.listdir(mal_dir)[0])
    
    if image_path is None:
        print("Could not find a test image.")
        return

    print(f"Testing with image: {image_path}")
    
    # Read image
    with open(image_path, 'rb') as f:
        img_bytes = f.read()
        
    # Convert to numpy array for predict_image (which expects bytes or buffer?)
    # predict_image in model.py:
    # img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)
    # So it expects a numpy array of bytes (uint8)
    
    img_array = np.frombuffer(img_bytes, np.uint8)
    
    result = predict_image(model, img_array)
    print("Prediction Result:")
    print(result)
    
    if 'label' in result and 'risk_level' in result and 'confidence' in result:
        print("Verification SUCCESS.")
    else:
        print("Verification FAILED: Missing keys in result.")

if __name__ == "__main__":
    verify()
