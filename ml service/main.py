from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import pickle
import pandas as pd
import numpy as np

app = FastAPI(
    title="AgriHub Credit Scoring API",
    description="ML-powered credit scoring service for farmer loan eligibility",
    version="1.0.0"
)

# -----------------------------
# Load trained model + scaler
# -----------------------------
try:
    with open("model.pkl", "rb") as model_file:
        model = pickle.load(model_file)

    with open("scaler.pkl", "rb") as scaler_file:
        scaler = pickle.load(scaler_file)

except FileNotFoundError as e:
    raise RuntimeError(f"Required model file not found: {e}")

# -----------------------------
# Feature order used in training
# IMPORTANT: must match training
# -----------------------------
FEATURE_COLUMNS = [
    "total_sales",
    "num_transactions",
    "avg_transaction_value",
    "activity_frequency",
    "repayment_history",
    "high_value_tx_count",
    "blockchain_verified_ratio"
]

# -----------------------------
# Request schema
# -----------------------------
class CreditScoreRequest(BaseModel):
    total_sales: float = Field(..., ge=0, description="Total farmer sales in naira")
    num_transactions: int = Field(..., ge=1, description="Total completed transactions")
    activity_frequency: int = Field(..., ge=0, le=31, description="Active selling days per month")
    repayment_history: int = Field(..., ge=0, le=1, description="1 if farmer has good repayment history, else 0")
    high_value_tx_count: int = Field(..., ge=0, description="Transactions above threshold, e.g. ₦5,000")
    verified_high_value_tx: int = Field(..., ge=0, description="Number of blockchain-verified high-value transactions")

# -----------------------------
# Response schema
# -----------------------------
class CreditScoreResponse(BaseModel):
    credit_score: int
    probability_of_eligibility: float
    loan_eligible: bool
    suggested_loan_amount: float
    risk_level: str
    reasons: list[str]

# -----------------------------
# Health check
# -----------------------------
@app.get("/")
def root():
    return {
        "message": "AgriHub Credit Scoring API is running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None
    }

# -----------------------------
# Helper functions
# -----------------------------
def validate_business_logic(data: CreditScoreRequest) -> None:
    """
    Extra validation beyond Pydantic.
    """
    if data.high_value_tx_count > data.num_transactions:
        raise HTTPException(
            status_code=400,
            detail="high_value_tx_count cannot be greater than num_transactions"
        )

    if data.verified_high_value_tx > data.high_value_tx_count:
        raise HTTPException(
            status_code=400,
            detail="verified_high_value_tx cannot be greater than high_value_tx_count"
        )

def calculate_loan_amount(total_sales: float, avg_transaction_value: float, credit_score: int) -> float:
    """
    Hybrid loan logic:
    - ML score determines trust
    - Rule-based cap determines safe amount
    """
    base_loan = min(
        total_sales * 0.3,
        avg_transaction_value * 10
    )

    final_loan = base_loan * (credit_score / 100)

    return round(min(final_loan, 500000), 2)

def get_risk_level(credit_score: int) -> str:
    if credit_score >= 80:
        return "low"
    elif credit_score >= 60:
        return "medium"
    elif credit_score >= 40:
        return "high"
    return "very_high"

def generate_reasons(data: CreditScoreRequest, credit_score: int) -> list[str]:
    reasons = []

    if data.total_sales >= 300000:
        reasons.append("Strong total sales volume")
    elif data.total_sales < 50000:
        reasons.append("Low total sales reduces borrowing capacity")

    if data.activity_frequency >= 15:
        reasons.append("Consistent marketplace activity")
    elif data.activity_frequency < 5:
        reasons.append("Low activity frequency")

    if data.repayment_history == 1:
        reasons.append("Positive repayment history")
    else:
        reasons.append("No proven repayment history")

    blockchain_verified_ratio = (
        data.verified_high_value_tx / data.high_value_tx_count
        if data.high_value_tx_count > 0 else 0.0
    )
    if blockchain_verified_ratio >= 0.7:
        reasons.append("High proportion of blockchain-verified transactions")
    elif blockchain_verified_ratio < 0.3:
        reasons.append("Low blockchain verification ratio")

    if data.high_value_tx_count >= 10:
        reasons.append("Good number of high-value transactions")

    if not reasons:
        reasons.append("Score based on combined behavioral and transaction features")

    # keep response concise
    return reasons[:2]

# -----------------------------
# Prediction endpoint
# -----------------------------
@app.post("/credit-score", response_model=CreditScoreResponse)
def predict_credit_score(data: CreditScoreRequest):
    try:
        validate_business_logic(data)

        # Derive computed features
        avg_transaction_value = data.total_sales / data.num_transactions
        blockchain_verified_ratio = (
            data.verified_high_value_tx / data.high_value_tx_count
            if data.high_value_tx_count > 0 else 0.0
        )

        input_dict = {
            "total_sales": data.total_sales,
            "num_transactions": data.num_transactions,
            "avg_transaction_value": avg_transaction_value,
            "activity_frequency": data.activity_frequency,
            "repayment_history": data.repayment_history,
            "high_value_tx_count": data.high_value_tx_count,
            "blockchain_verified_ratio": blockchain_verified_ratio
        }

        input_df = pd.DataFrame([input_dict], columns=FEATURE_COLUMNS)

        # Scale input
        input_scaled = scaler.transform(input_df)

        # Model prediction
        probability = float(model.predict_proba(input_scaled)[0][1])
        prediction = int(model.predict(input_scaled)[0])

        # Convert probability to score
        credit_score = int(round(probability * 100))

        # Optional rule: use both model output and score threshold
        loan_eligible = bool(prediction == 1 and credit_score >= 60)

        suggested_loan_amount = calculate_loan_amount(
            total_sales=data.total_sales,
            avg_transaction_value=avg_transaction_value,
            credit_score=credit_score
        )

        # If not eligible, suggested loan should be 0
        if not loan_eligible:
            suggested_loan_amount = 0.0

        return CreditScoreResponse(
            credit_score=credit_score,
            probability_of_eligibility=round(probability, 4),
            loan_eligible=loan_eligible,
            suggested_loan_amount=suggested_loan_amount,
            risk_level=get_risk_level(credit_score),
            reasons=generate_reasons(data, credit_score)
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")