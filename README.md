# AgriHub

AgriHub is an AI-powered agricultural marketplace and credit platform designed to help farmers:

- Sell produce more efficiently
- Build verifiable transaction histories
- Access loans based on real economic activity

The platform combines:

- Marketplace (farmers ↔ buyers)
- Machine Learning (credit scoring)
- Blockchain-inspired verification (trust layer)
- Payment integration (loan disbursement & repayment)

---

## Problem

Millions of farmers:

- Sell products informally and struggle to find competitive buyers
- Lack financial records
- Cannot access loans

Traditional lenders require:

- Bank history
- Credit score
- Collateral

Most farmers do not have these.

---

## Solution

AgriHub creates a digital financial identity for farmers using:

- Transaction activity
- Marketplace behavior
- Repayment patterns

It then uses machine learning to:

- Predict loan eligibility
- Recommend safe loan amounts

---

## Key Idea

"Your farming activity becomes your credit score"

---

## System Architecture

```

Frontend (Next.js)
↓
Backend Services
├── ML Credit Scoring API (FastAPI)
├── Blockchain Verification Layer (Local)
├── Payment Integration (Interswitch)
↓
Cloud Services (Firebase, Cloudinary)

````

---

## Core Components

### 1. Marketplace

Farmers can:

- Create listings
- Upload produce images
- Set prices and quantities

Buyers can:

- Browse products
- View details
- Place orders

---

### 2. Orders & Transactions

The system tracks:

- Completed sales
- Transaction values
- Frequency of activity

This data is used for credit scoring.

---

### 3. Payments

Planned flow:

- Buyers pay for produce
- Farmers receive funds
- Loan repayment processing

Supports:

- Direct payments
- Future integration with providers (e.g., Interswitch)

---

### 4. ML Credit Scoring (Agrihub-ML)

Separate repository:  
https://github.com/Jaykay73/Agrihub-ML

This service:

- Receives farmer activity data
- Processes it using a trained model
- Returns:

```json
{
  "credit_score": 78,
  "loan_eligible": true,
  "probability_of_eligibility": 0.78
}
````

#### Features Used by the Model

* Total sales
* Number of transactions
* Average transaction value
* Activity frequency
* Repayment history
* High-value transactions
* Blockchain verification ratio

#### Output

* Credit score (0–100)
* Loan eligibility
* Suggested loan amount
* Risk level

---

### 5. Blockchain Verification (Local)

AgriHub includes a local blockchain layer to improve trust.

#### What it does

* Batches transactions
* Hashes them using a Merkle Tree
* Stores only the root on-chain

#### Why

* Detect tampering
* Prove transaction integrity
* Improve trust in credit scoring

---

### 6. Loan System

#### Flow

1. Farmer builds transaction history
2. ML model evaluates risk
3. Loan is approved or rejected

If approved:

* Funds are disbursed via payment API
* Farmer repays over time
* Repayment updates future scores

---

## User Roles

### Farmer

* Lists produce
* Receives orders
* Builds credit history
* Applies for loans

### Buyer

* Browses marketplace
* Purchases produce
* Interacts with sellers

### Platform / Lender

* Evaluates credit scores
* Approves loans
* Manages repayments

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend / Services

* FastAPI (ML API)
* Python (ML models)
* Firebase (data storage)
* Cloudinary (media storage)

### Machine Learning

* scikit-learn
* pandas
* numpy

### Other Tools

* React Query (data fetching)
* ethers (future blockchain integration)

---

## Project Structure

```

AgriHub/
├── app/                # Next.js routes (buyer, farmer, auth)
├── features/           # Business logic modules
│   ├── marketplace/
│   ├── loans/
│   ├── payments/
│   ├── orders/
│   └── listings/
├── lib/                # Utilities (firebase, cloudinary, etc.)
├── shared/             # Shared components & types
├── ml-service/         # Local ML service copy

```

---

## Running the Project

### Frontend

```bash
npm install
npm run dev
```

Open:
[http://localhost:3000](http://localhost:3000)

---

### ML Backend

```bash
cd agrihub-ml

pip install -r requirements.txt
uvicorn app:app --reload
```

Open:
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## API Integration

Example:

```javascript
fetch("/credit-score", {
  method: "POST",
  body: JSON.stringify(data)
});
```

---

## Future Enhancements

* Full blockchain node network
* Real-time credit scoring dashboard
* Automated loan repayment tracking
* AI-based fraud detection
* Mobile application
* Logistics and delivery integration

---

## Impact

AgriHub aims to:

* Empower farmers financially
* Reduce loan risk using data
* Digitize agricultural trade
* Create fair access to credit

---

## Key Innovation

AgriHub does not just sell farm produce.

It turns economic activity into financial identity.

---

## Author

Built by:
Aledare John Oluwaseun (ML Engineer)
Onoja Possible (Fullstack Engineer)

