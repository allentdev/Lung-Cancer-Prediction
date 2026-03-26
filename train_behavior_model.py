import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import pickle
import os

# Define paths
DATA_PATH = 'data/behaviour/survey lung cancer.csv'
MODEL_PATH = 'models/behavior_model.pkl'

def train_model():
    if not os.path.exists(DATA_PATH):
        print(f"Data file not found at {DATA_PATH}")
        return

    print("Loading data...")
    df = pd.read_csv(DATA_PATH)

    # Preprocessing
    le = LabelEncoder()
    df['GENDER'] = le.fit_transform(df['GENDER']) # M=1, F=0 usually, or similar
    df['LUNG_CANCER'] = le.fit_transform(df['LUNG_CANCER']) # YES=1, NO=0

    # Features and Target
    X = df.drop('LUNG_CANCER', axis=1)
    y = df['LUNG_CANCER']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Model
    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")

    # Save Model
    print(f"Saving model to {MODEL_PATH}...")
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    
    print("Done!")

if __name__ == "__main__":
    train_model()
