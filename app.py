from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os

app = Flask(__name__, static_folder='static')
CORS(app)

# Create a simple mock dataset
np.random.seed(0)
X = np.random.rand(1000, 4) * 100  # 4 features: income, credit_score, loan_amount, loan_term
y = (X[:, 0] * 0.5 + X[:, 1] * 0.3 - X[:, 2] * 0.2 + X[:, 3] * 0.1 > 60).astype(int)  # Simple rule for eligibility

# Train the model
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
model = LogisticRegression()
model.fit(X_scaled, y)

# Save the model and scaler
joblib.dump(model, 'loan_model.joblib')
joblib.dump(scaler, 'scaler.joblib')

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/predict', methods=['POST'])
def predict_eligibility():
    data = request.json
    features = np.array([[
        float(data['income']),
        float(data['creditScore']),
        float(data['loanAmount']),
        float(data['loanTerm'])
    ]])
    
    scaler = joblib.load('scaler.joblib')
    model = joblib.load('loan_model.joblib')
    
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0][1]
    
    return jsonify({
        'eligible': bool(prediction),
        'probability': float(probability)
    })

if __name__ == '__main__':
    app.run(debug=True)