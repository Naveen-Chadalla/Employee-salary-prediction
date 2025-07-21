import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# === Init App ===
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Load Pipeline ===
model = joblib.load("model.pkl")

# === Request Schema ===
class FormData(BaseModel):
    age: int
    workclass: str
    education: str
    marital_status: str
    occupation: str
    gender: str
    capital_gain: int
    capital_loss: int
    hours_per_week: int
    native_country: str

# === Prediction Endpoint ===
@app.post("/predict")
def predict(data: FormData):
    try:
        # Convert to DataFrame for prediction
        input_df = pd.DataFrame([{
            "age": data.age,
            "workclass": data.workclass,
            "education": data.education,
            "marital-status": data.marital_status,
            "occupation": data.occupation,
            "gender": data.gender,
            "capital-gain": data.capital_gain,
            "capital-loss": data.capital_loss,
            "hours-per-week": data.hours_per_week,
            "native-country": data.native_country
        }])

        # Predict directly
        prediction = model.predict(input_df)[0]
        return {"prediction": prediction}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))