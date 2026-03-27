import streamlit as st
import pickle
import pandas as pd
import numpy as np
import math
import os

# ─────────────────────────────────────────────
# Page config
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="AgriHub Credit Scorer",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─────────────────────────────────────────────
# Custom CSS
# ─────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* ── Global ── */
html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
}
.stApp {
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d1b2a 100%);
}

/* ── Header ── */
.hero-header {
    background: linear-gradient(135deg, #00c853 0%, #00bfa5 50%, #00897b 100%);
    border-radius: 20px;
    padding: 2rem 2.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(0, 200, 83, 0.25);
    position: relative;
    overflow: hidden;
}
.hero-header::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
    border-radius: 50%;
}
.hero-header h1 {
    color: #fff;
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.5px;
}
.hero-header p {
    color: rgba(255,255,255,0.85);
    font-size: 1rem;
    margin: 0.4rem 0 0 0;
    font-weight: 400;
}

/* ── Metric Cards ── */
.metric-card {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.metric-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,200,83,0.15);
}
.metric-card .label {
    color: rgba(255,255,255,0.5);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
}
.metric-card .value {
    color: #fff;
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0.3rem 0;
}
.metric-card .sub {
    color: rgba(255,255,255,0.4);
    font-size: 0.8rem;
}

/* ── Badges ── */
.badge-eligible {
    display: inline-block;
    background: linear-gradient(135deg, #00c853, #00e676);
    color: #fff;
    font-weight: 700;
    padding: 0.6rem 2rem;
    border-radius: 50px;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(0,200,83,0.4);
    animation: pulse-green 2s infinite;
}
.badge-ineligible {
    display: inline-block;
    background: linear-gradient(135deg, #ff1744, #ff5252);
    color: #fff;
    font-weight: 700;
    padding: 0.6rem 2rem;
    border-radius: 50px;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(255,23,68,0.4);
}

@keyframes pulse-green {
    0%, 100% { box-shadow: 0 4px 15px rgba(0,200,83,0.4); }
    50% { box-shadow: 0 4px 30px rgba(0,200,83,0.7); }
}

/* ── Risk badges ── */
.risk-low { color: #00e676; }
.risk-medium { color: #ffab00; }
.risk-high { color: #ff6d00; }
.risk-very_high { color: #ff1744; }

/* ── Reason chips ── */
.reason-chip {
    display: inline-block;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.8);
    padding: 0.4rem 1rem;
    border-radius: 50px;
    font-size: 0.82rem;
    margin: 0.25rem 0.25rem;
}

/* ── Sidebar ── */
section[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #111132 0%, #0d1b2a 100%);
    border-right: 1px solid rgba(255,255,255,0.06);
}
section[data-testid="stSidebar"] .stMarkdown h2 {
    color: #00e676;
}

/* ── Tabs ── */
.stTabs [data-baseweb="tab-list"] {
    gap: 8px;
}
.stTabs [data-baseweb="tab"] {
    border-radius: 10px;
    padding: 8px 20px;
    color: rgba(255,255,255,0.6);
    font-weight: 600;
}
.stTabs [aria-selected="true"] {
    background: rgba(0,200,83,0.15);
    color: #00e676 !important;
    border-bottom: 2px solid #00e676;
}

/* ── Hide default Streamlit branding ── */
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
header {visibility: hidden;}

/* Cards section heading */
.section-title {
    color: rgba(255,255,255,0.4);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    margin-bottom: 0.8rem;
}

/* ── CSS Gauge ── */
.gauge-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
}
.gauge-wrap {
    position: relative;
    width: 220px;
    height: 120px;
    overflow: hidden;
}
.gauge-bg {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: conic-gradient(
        #ff1744 0deg 72deg,
        #ff6d00 72deg 144deg,
        #ffab00 144deg 216deg,
        #00e676 216deg 360deg
    );
    opacity: 0.15;
}
.gauge-inner {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: #13132e;
}
.gauge-needle {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 3px;
    height: 90px;
    background: #fff;
    transform-origin: bottom center;
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(255,255,255,0.5);
    transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.gauge-score {
    font-size: 3.5rem;
    font-weight: 800;
    color: #fff;
    text-align: center;
    margin-top: 0.5rem;
    text-shadow: 0 0 30px rgba(255,255,255,0.15);
}
.gauge-label {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
}

/* ── Bar Charts ── */
.bar-row {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
}
.bar-label {
    color: rgba(255,255,255,0.6);
    font-size: 0.75rem;
    width: 100px;
    text-align: right;
    padding-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.bar-track {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border-radius: 6px;
    height: 16px;
    overflow: hidden;
}
.bar-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.6s ease;
}
.bar-value {
    color: rgba(255,255,255,0.4);
    font-size: 0.7rem;
    width: 40px;
    padding-left: 8px;
}

/* ── Dataset stat cards ── */
.stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
}
@media (max-width: 768px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# Load model artifacts
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@st.cache_resource
def load_model():
    with open(os.path.join(BASE_DIR, "model.pkl"), "rb") as f:
        model = pickle.load(f)
    with open(os.path.join(BASE_DIR, "scaler.pkl"), "rb") as f:
        scaler = pickle.load(f)
    return model, scaler

@st.cache_data
def load_dataset():
    return pd.read_csv(os.path.join(BASE_DIR, "agri_credit_dataset.csv"))

model, scaler = load_model()

FEATURE_COLUMNS = [
    "total_sales", "num_transactions", "avg_transaction_value",
    "activity_frequency", "repayment_history",
    "high_value_tx_count", "blockchain_verified_ratio"
]

# ─────────────────────────────────────────────
# Prediction helpers (mirrored from main.py)
# ─────────────────────────────────────────────
def predict(total_sales, num_transactions, activity_frequency,
            repayment_history, high_value_tx_count, verified_high_value_tx):
    avg_transaction_value = total_sales / max(num_transactions, 1)
    blockchain_verified_ratio = (
        verified_high_value_tx / high_value_tx_count
        if high_value_tx_count > 0 else 0.0
    )
    input_dict = {
        "total_sales": total_sales,
        "num_transactions": num_transactions,
        "avg_transaction_value": avg_transaction_value,
        "activity_frequency": activity_frequency,
        "repayment_history": repayment_history,
        "high_value_tx_count": high_value_tx_count,
        "blockchain_verified_ratio": blockchain_verified_ratio,
    }
    input_df = pd.DataFrame([input_dict], columns=FEATURE_COLUMNS)
    input_scaled = scaler.transform(input_df)
    probability = float(model.predict_proba(input_scaled)[0][1])
    prediction = int(model.predict(input_scaled)[0])
    credit_score = int(round(probability * 100))
    loan_eligible = bool(prediction == 1 and credit_score >= 60)

    # Loan amount logic
    base_loan = min(total_sales * 0.3, avg_transaction_value * 10)
    suggested_loan = round(min(base_loan * (credit_score / 100), 500_000), 2)
    if not loan_eligible:
        suggested_loan = 0.0

    # Risk level
    if credit_score >= 80:
        risk_level = "low"
    elif credit_score >= 60:
        risk_level = "medium"
    elif credit_score >= 40:
        risk_level = "high"
    else:
        risk_level = "very_high"

    # Reasons
    reasons = []
    if total_sales >= 300_000:
        reasons.append("Strong total sales volume")
    elif total_sales < 50_000:
        reasons.append("Low total sales reduces borrowing capacity")
    if activity_frequency >= 15:
        reasons.append("Consistent marketplace activity")
    elif activity_frequency < 5:
        reasons.append("Low activity frequency")
    if repayment_history == 1:
        reasons.append("Positive repayment history")
    else:
        reasons.append("No proven repayment history")
    if blockchain_verified_ratio >= 0.7:
        reasons.append("High blockchain-verified transactions")
    elif blockchain_verified_ratio < 0.3:
        reasons.append("Low blockchain verification ratio")
    if high_value_tx_count >= 10:
        reasons.append("Good number of high-value transactions")
    if not reasons:
        reasons.append("Score based on combined features")
    reasons = reasons[:3]

    return {
        "credit_score": credit_score,
        "probability": probability,
        "loan_eligible": loan_eligible,
        "suggested_loan": suggested_loan,
        "risk_level": risk_level,
        "reasons": reasons,
    }


def render_gauge(score):
    """Render a pure-CSS semicircle gauge."""
    # Map score 0-100 to needle angle -90deg to +90deg
    angle = -90 + (score / 100) * 180
    if score >= 80:
        glow_color = "0,230,118"
    elif score >= 60:
        glow_color = "255,171,0"
    elif score >= 40:
        glow_color = "255,109,0"
    else:
        glow_color = "255,23,68"

    return f"""
    <div class="gauge-container">
        <div class="gauge-wrap">
            <div class="gauge-bg"></div>
            <div class="gauge-inner"></div>
            <div class="gauge-needle" style="transform: rotate({angle}deg);"></div>
        </div>
        <div class="gauge-score" style="text-shadow: 0 0 40px rgba({glow_color},0.4);">{score}</div>
        <div class="gauge-label">Credit Score</div>
    </div>
    """


def render_bar_chart(data, colors=None):
    """Render horizontal bar chart with pure HTML/CSS."""
    if colors is None:
        colors = ["#00e676"] * len(data)
    max_val = max(v for _, v in data) if data else 1
    html = ""
    for i, (label, value) in enumerate(data):
        pct = (value / max_val) * 100 if max_val > 0 else 0
        color = colors[i % len(colors)]
        html += f"""
        <div class="bar-row">
            <div class="bar-label">{label}</div>
            <div class="bar-track">
                <div class="bar-fill" style="width:{pct}%; background:{color};"></div>
            </div>
            <div class="bar-value">{value:,.0f}</div>
        </div>
        """
    return html


# ─────────────────────────────────────────────
# Sidebar inputs
# ─────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🌾 AgriHub")
    st.markdown("##### Credit Score Tester")
    st.markdown("---")

    # Sample profiles
    st.markdown("**Quick Profiles**")
    profile_cols = st.columns(2)
    with profile_cols[0]:
        if st.button("🟢 Low Risk", use_container_width=True):
            st.session_state.update(
                ts=1_500_000, nt=120, af=22, rh=True, hvtx=80, vhvtx=65
            )
    with profile_cols[1]:
        if st.button("🔴 High Risk", use_container_width=True):
            st.session_state.update(
                ts=25_000, nt=5, af=2, rh=False, hvtx=1, vhvtx=0
            )
    profile_cols2 = st.columns(2)
    with profile_cols2[0]:
        if st.button("🟡 Borderline", use_container_width=True):
            st.session_state.update(
                ts=450_000, nt=45, af=12, rh=True, hvtx=20, vhvtx=5
            )
    with profile_cols2[1]:
        if st.button("🔵 New Farmer", use_container_width=True):
            st.session_state.update(
                ts=80_000, nt=10, af=6, rh=False, hvtx=3, vhvtx=0
            )

    st.markdown("---")
    st.markdown("**Farmer Data**")

    total_sales = st.number_input(
        "Total Sales (₦)", min_value=0.0,
        value=float(st.session_state.get("ts", 500_000)),
        step=10_000.0, format="%.2f", key="input_ts"
    )
    num_transactions = st.number_input(
        "Number of Transactions", min_value=1,
        value=int(st.session_state.get("nt", 50)),
        step=1, key="input_nt"
    )
    activity_frequency = st.slider(
        "Activity Frequency (days/month)", 0, 31,
        value=int(st.session_state.get("af", 15)), key="input_af"
    )
    repayment_history = st.toggle(
        "Good Repayment History",
        value=bool(st.session_state.get("rh", True)), key="input_rh"
    )
    high_value_tx_count = st.number_input(
        "High-Value TX Count", min_value=0,
        value=int(st.session_state.get("hvtx", 20)), step=1, key="input_hvtx"
    )
    verified_high_value_tx = st.number_input(
        "Verified High-Value TX", min_value=0,
        value=int(st.session_state.get("vhvtx", 10)), step=1, key="input_vhvtx"
    )

# ─────────────────────────────────────────────
# Header
# ─────────────────────────────────────────────
st.markdown("""
<div class="hero-header">
    <h1>🌾 AgriHub Credit Scorer</h1>
    <p>ML-powered credit scoring for farmer loan eligibility — powered by blockchain-verified transaction data</p>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# Tabs
# ─────────────────────────────────────────────
tab_score, tab_explore = st.tabs(["📊  Score Prediction", "📈  Dataset Explorer"])

with tab_score:

    # Validation
    error = None
    if high_value_tx_count > num_transactions:
        error = "⚠️ High-value TX count cannot exceed total transactions."
    if verified_high_value_tx > high_value_tx_count:
        error = "⚠️ Verified high-value TX cannot exceed high-value TX count."

    if error:
        st.error(error)
    else:
        result = predict(
            total_sales=total_sales,
            num_transactions=num_transactions,
            activity_frequency=activity_frequency,
            repayment_history=int(repayment_history),
            high_value_tx_count=high_value_tx_count,
            verified_high_value_tx=verified_high_value_tx,
        )

        # ── Gauge + Eligibility ──
        col_gauge, col_info = st.columns([1, 1], gap="large")
        with col_gauge:
            st.markdown('<div class="section-title">Credit Score</div>', unsafe_allow_html=True)
            st.markdown(render_gauge(result["credit_score"]), unsafe_allow_html=True)

        with col_info:
            st.markdown('<div class="section-title">Loan Decision</div>', unsafe_allow_html=True)
            if result["loan_eligible"]:
                st.markdown('<div class="badge-eligible">✅ Eligible for Loan</div>', unsafe_allow_html=True)
            else:
                st.markdown('<div class="badge-ineligible">❌ Not Eligible</div>', unsafe_allow_html=True)

            st.markdown("<br>", unsafe_allow_html=True)

            # Metric cards row
            m1, m2, m3 = st.columns(3)
            with m1:
                risk_cls = f"risk-{result['risk_level']}"
                st.markdown(f"""
                <div class="metric-card">
                    <div class="label">Risk Level</div>
                    <div class="value {risk_cls}">{result['risk_level'].replace('_',' ').title()}</div>
                </div>
                """, unsafe_allow_html=True)
            with m2:
                st.markdown(f"""
                <div class="metric-card">
                    <div class="label">Probability</div>
                    <div class="value">{result['probability']:.1%}</div>
                </div>
                """, unsafe_allow_html=True)
            with m3:
                st.markdown(f"""
                <div class="metric-card">
                    <div class="label">Suggested Loan</div>
                    <div class="value">₦{result['suggested_loan']:,.0f}</div>
                </div>
                """, unsafe_allow_html=True)

            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown('<div class="section-title">Key Reasons</div>', unsafe_allow_html=True)
            chips_html = " ".join(
                f'<span class="reason-chip">{r}</span>' for r in result["reasons"]
            )
            st.markdown(chips_html, unsafe_allow_html=True)

        # ── Feature breakdown ──
        st.markdown("---")
        st.markdown('<div class="section-title">Input Feature Breakdown</div>', unsafe_allow_html=True)

        avg_tv = total_sales / max(num_transactions, 1)
        bvr = verified_high_value_tx / high_value_tx_count if high_value_tx_count > 0 else 0.0

        features = [
            ("Total Sales (₦)", f"₦{total_sales:,.2f}"),
            ("Num Transactions", str(num_transactions)),
            ("Avg TX Value (₦)", f"₦{avg_tv:,.2f}"),
            ("Activity Freq", f"{activity_frequency} days/mo"),
            ("Repayment History", "✅ Yes" if repayment_history else "❌ No"),
            ("High-Value TX", str(high_value_tx_count)),
            ("Blockchain Ratio", f"{bvr:.2%}"),
        ]

        fcols = st.columns(4)
        for i, (feat_name, feat_val) in enumerate(features):
            with fcols[i % 4]:
                st.markdown(f"""
                <div class="metric-card" style="margin-bottom:0.8rem;">
                    <div class="label">{feat_name}</div>
                    <div class="value" style="font-size:1.2rem;">{feat_val}</div>
                </div>
                """, unsafe_allow_html=True)

with tab_explore:
    df = load_dataset()

    # ── Overview Stats ──
    st.markdown('<div class="section-title">Dataset Overview</div>', unsafe_allow_html=True)

    eligible_count = int(df["loan_eligible"].sum())
    ineligible_count = len(df) - eligible_count
    eligible_pct = df["loan_eligible"].mean() * 100

    st.markdown(f"""
    <div class="stat-grid">
        <div class="metric-card">
            <div class="label">Total Farmers</div>
            <div class="value">{len(df):,}</div>
        </div>
        <div class="metric-card">
            <div class="label">Eligible</div>
            <div class="value" style="color:#00e676">{eligible_pct:.1f}%</div>
            <div class="sub">{eligible_count} farmers</div>
        </div>
        <div class="metric-card">
            <div class="label">Avg Sales</div>
            <div class="value">₦{df['total_sales'].mean():,.0f}</div>
        </div>
        <div class="metric-card">
            <div class="label">Avg TX Count</div>
            <div class="value">{df['num_transactions'].mean():.0f}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ── Eligibility Split Bar ──
    st.markdown('<div class="section-title">Eligibility Distribution</div>', unsafe_allow_html=True)
    elig_pct = eligible_count / len(df) * 100
    st.markdown(f"""
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.5rem;">
        <div style="flex:1;background:rgba(255,255,255,0.06);border-radius:10px;height:28px;overflow:hidden;display:flex;">
            <div style="width:{elig_pct}%;background:linear-gradient(90deg,#00c853,#00e676);border-radius:10px 0 0 10px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:#fff;font-weight:700;">
                Eligible {elig_pct:.1f}%
            </div>
            <div style="width:{100-elig_pct}%;background:linear-gradient(90deg,#ff5252,#ff1744);border-radius:0 10px 10px 0;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:#fff;font-weight:700;">
                Not Eligible {100-elig_pct:.1f}%
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ── Sales Distribution (bucketized bar chart) ──
    ch1, ch2 = st.columns(2)

    with ch1:
        st.markdown('<div class="section-title">Sales Distribution</div>', unsafe_allow_html=True)
        bins = [0, 100_000, 300_000, 500_000, 1_000_000, 2_000_000, 5_000_000, float('inf')]
        labels = ["<100K", "100K-300K", "300K-500K", "500K-1M", "1M-2M", "2M-5M", "5M+"]
        df["sales_bucket"] = pd.cut(df["total_sales"], bins=bins, labels=labels, right=False)
        bucket_counts = df["sales_bucket"].value_counts().reindex(labels).fillna(0)

        bar_data = [(label, int(count)) for label, count in zip(labels, bucket_counts)]
        gradient_colors = ["#ff5252", "#ff6d00", "#ffab00", "#ffd600", "#76ff03", "#00e676", "#00c853"]
        st.markdown(render_bar_chart(bar_data, gradient_colors), unsafe_allow_html=True)

    with ch2:
        st.markdown('<div class="section-title">Key Feature Averages</div>', unsafe_allow_html=True)

        # Compare eligible vs ineligible averages
        elig = df[df["loan_eligible"] == 1]
        inelig = df[df["loan_eligible"] == 0]

        compare_features = [
            ("Avg Sales (₦K)", elig["total_sales"].mean() / 1000, inelig["total_sales"].mean() / 1000),
            ("Avg TX Count", elig["num_transactions"].mean(), inelig["num_transactions"].mean()),
            ("Activity Freq", elig["activity_frequency"].mean(), inelig["activity_frequency"].mean()),
            ("Blockchain %", elig["blockchain_verified_ratio"].mean() * 100, inelig["blockchain_verified_ratio"].mean() * 100),
            ("High-Val TX", elig["high_value_tx_count"].mean(), inelig["high_value_tx_count"].mean()),
        ]

        for feat_name, elig_val, inelig_val in compare_features:
            max_val = max(elig_val, inelig_val, 1)
            elig_w = elig_val / max_val * 100
            inelig_w = inelig_val / max_val * 100
            st.markdown(f"""
            <div style="margin-bottom:0.6rem;">
                <div style="color:rgba(255,255,255,0.5);font-size:0.72rem;margin-bottom:4px;font-weight:600;">{feat_name}</div>
                <div style="display:flex;gap:6px;align-items:center;">
                    <div style="flex:1;">
                        <div style="background:rgba(255,255,255,0.06);border-radius:5px;height:12px;overflow:hidden;">
                            <div style="width:{elig_w}%;background:#00e676;height:100%;border-radius:5px;"></div>
                        </div>
                    </div>
                    <div style="color:#00e676;font-size:0.7rem;width:55px;text-align:right;">{elig_val:,.1f}</div>
                </div>
                <div style="display:flex;gap:6px;align-items:center;margin-top:2px;">
                    <div style="flex:1;">
                        <div style="background:rgba(255,255,255,0.06);border-radius:5px;height:12px;overflow:hidden;">
                            <div style="width:{inelig_w}%;background:#ff5252;height:100%;border-radius:5px;"></div>
                        </div>
                    </div>
                    <div style="color:#ff5252;font-size:0.7rem;width:55px;text-align:right;">{inelig_val:,.1f}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("""
        <div style="display:flex;gap:16px;margin-top:0.5rem;">
            <div style="display:flex;align-items:center;gap:5px;">
                <div style="width:10px;height:10px;background:#00e676;border-radius:50%;"></div>
                <span style="color:rgba(255,255,255,0.5);font-size:0.7rem;">Eligible</span>
            </div>
            <div style="display:flex;align-items:center;gap:5px;">
                <div style="width:10px;height:10px;background:#ff5252;border-radius:50%;"></div>
                <span style="color:rgba(255,255,255,0.5);font-size:0.7rem;">Not Eligible</span>
            </div>
        </div>
        """, unsafe_allow_html=True)

    # ── Repayment vs Eligibility ──
    st.markdown("---")
    st.markdown('<div class="section-title">Repayment History Impact</div>', unsafe_allow_html=True)

    rep1, rep0 = st.columns(2)
    with_repay = df[df["repayment_history"] == 1]
    without_repay = df[df["repayment_history"] == 0]
    with_repay_elig = with_repay["loan_eligible"].mean() * 100
    without_repay_elig = without_repay["loan_eligible"].mean() * 100

    with rep1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="label">With Repayment History</div>
            <div class="value" style="color:#00e676">{with_repay_elig:.1f}%</div>
            <div class="sub">of {len(with_repay)} farmers are eligible</div>
        </div>
        """, unsafe_allow_html=True)
    with rep0:
        st.markdown(f"""
        <div class="metric-card">
            <div class="label">Without Repayment History</div>
            <div class="value" style="color:#ff5252">{without_repay_elig:.1f}%</div>
            <div class="sub">of {len(without_repay)} farmers are eligible</div>
        </div>
        """, unsafe_allow_html=True)

    # Raw data preview
    st.markdown("---")
    with st.expander("🔍 View Raw Data"):
        st.dataframe(df, use_container_width=True, height=400)
