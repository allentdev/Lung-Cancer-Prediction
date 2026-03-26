# Early Lung Cancer Detection System

A comprehensive web application for early lung cancer detection. The system combines deep learning-based Computed Tomography (CT) scan analysis with a machine learning behavioral risk assessment model to provide accurate predictions and personalized recommendations.

## Project Structure
- `app.py`: The main Flask application server.
- `frontend/`: React + Vite frontend source code. (The production build is located in `frontend/dist`).
- `src/`: Python source code containing utility functions and model inference logic.
- `models/`: Directory containing pre-trained models (`resnet_lung_cancer.h5` and `behavior_model.pkl`).
- `data/`: Datasets used for training the models.
- `notebooks/`: Jupyter notebooks used for data exploration and model training.

## Prerequisites

To run the project on a new system, you will need:
- **Python 3.8+**
- **Node.js 18+** (Only needed if you want to modify and rebuild the frontend)

## Installation & Setup

### 1. Clone the Repository
Clone or copy the project files to your new system and navigate to the project root directory:
```bash
cd Early_Lung_Cancer_Detection
```

### 2. Set Up the Python Backend
Create a virtual environment:
```bash
# On Windows
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install the required Python dependencies:
```bash
pip install -r requirements.txt
```

### 3. Run the Application
Since the frontend is already pre-built inside the `frontend/dist` directory, you only need to start the Flask server to run the application:
```bash
python app.py
```
After starting the server, open your web browser and go to:
[http://localhost:5000](http://localhost:5000)

## Frontend Development (Optional)
If you wish to make changes to the user interface, you'll need to set up the frontend project:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Or, build the frontend for production (this updates the `dist` folder used by Flask):
   ```bash
   npm run build
   ```

## Model Training (Optional)
If you wish to retrain the behavioral model based on new data:
```bash
python train_behavior_model.py
```
To verify the CT scan model predictions from command-line:
```bash
python verify_model.py
```
