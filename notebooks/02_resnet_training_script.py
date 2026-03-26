import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import os
import numpy as np
import cv2
import matplotlib.pyplot as plt
from sklearn.utils import shuffle

# Configuration
DATA_DIR = 'data/images/LungcancerDataSet/Data'
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 5  # Reduced to 5 for quicker turnaround, can increase if needed
LEARNING_RATE = 1e-4

def load_data(subset):
    """
    Loads data from the specified subset (train, valid, test) and maps classes to binary labels.
    0: Normal (Normal, Benign)
    1: Cancer (Malignant, Adenocarcinoma, etc.)
    """
    path = os.path.join(DATA_DIR, subset)
    images = []
    labels = []
    
    if not os.path.exists(path):
        print(f"Path not found: {path} (PWD: {os.getcwd()})")
        return np.array(images), np.array(labels)

    for folder in os.listdir(path):
        folder_path = os.path.join(path, folder)
        if not os.path.isdir(folder_path):
            continue
            
        # Determine label based on folder name
        lower_folder = folder.lower()
        if 'normal' in lower_folder or 'bengin' in lower_folder:
            label = 0
            print(f"Mapped {folder} to Normal (0)")
        else:
            label = 1
            print(f"Mapped {folder} to Cancer (1)")
            
        # Load images
        for filename in os.listdir(folder_path):
            img_path = os.path.join(folder_path, filename)
            
            # Basic check for image extensions
            if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue
                
            try:
                img = cv2.imread(img_path)
                if img is not None:
                    img = cv2.resize(img, IMG_SIZE)
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    images.append(img)
                    labels.append(label)
            except Exception as e:
                print(f"Error loading {img_path}: {e}")
                
    images = np.array(images)
    labels = np.array(labels)
    
    # Shuffle
    if len(images) > 0:
        images, labels = shuffle(images, labels, random_state=42)
    
    return images, labels

# Load datasets
print("Loading training data...")
X_train, y_train = load_data('train')
print(f"Training data shape: {X_train.shape}, Labels: {y_train.shape}")

print("Loading validation data...")
X_val, y_val = load_data('valid')
print(f"Validation data shape: {X_val.shape}, Labels: {y_val.shape}")

print("Loading test data...")
X_test, y_test = load_data('test')
print(f"Test data shape: {X_test.shape}, Labels: {y_test.shape}")

# Normalize pixel values
X_train = X_train / 255.0
X_val = X_val / 255.0
X_test = X_test / 255.0

# Check class balance
unique, counts = np.unique(y_train, return_counts=True)
print(f"Train setup: {dict(zip(unique, counts))}")

if len(X_train) == 0:
    print("No training data found. Exiting.")
    exit(1)

# Build Model
print("Building ResNet50 model...")
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3))

# Freeze base model layers
for layer in base_model.layers:
    layer.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
x = Dropout(0.5)(x)
predictions = Dense(1, activation='sigmoid')(x)

model = Model(inputs=base_model.input, outputs=predictions)

model.compile(optimizer=Adam(learning_rate=LEARNING_RATE),
              loss='binary_crossentropy',
              metrics=['accuracy'])

model.summary()

# Train Model
print("Starting training...")
history = model.fit(
    X_train, y_train,
    batch_size=BATCH_SIZE,
    epochs=EPOCHS,
    validation_data=(X_val, y_val)
)

# Evaluate on Test Set
print("Evaluating on test set...")
loss, acc = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {acc*100:.2f}%")

# Save Model
model_dir = 'models'
if not os.path.exists(model_dir):
    os.makedirs(model_dir)
    
save_path = os.path.join(model_dir, 'resnet_lung_cancer.h5')
model.save(save_path)
print(f"Model saved to {save_path}")
