from fastapi import APIRouter
from sqlalchemy import func, extract
from ..database import SessionLocal
from ..models import Expense

router = APIRouter(tags=["Insights"])

FIXED_YEARLY_BUDGET = 1_200_000


@router.get("/")
def insights():
    db = SessionLocal()
    insights = []

    try:
        total_spend = db.query(func.sum(Expense.amount)).scalar() or 0.0

        if total_spend == 0:
            return {"insights": []}

        vendor_totals = (
            db.query(
                Expense.vendor,
                func.sum(Expense.amount).label("amount")
            )
            .group_by(Expense.vendor)
            .all()
        )

        for vendor, amount in vendor_totals:
            share = float(amount) / total_spend
            if share > 0.4:
                insights.append({
                    "level": "warning",
                    "title": "Vendor Spend Concentration",
                    "message": f"{vendor} accounts for {share:.0%} of total expenditure.",
                    "recommendation": "Consider diversifying vendors to reduce dependency risk."
                })

        if total_spend > FIXED_YEARLY_BUDGET:
            overshoot = total_spend - FIXED_YEARLY_BUDGET
            insights.append({
                "level": "critical",
                "title": "Annual Budget Overrun",
                "message": f"Total spending exceeded the annual budget by ₹{overshoot:,.0f}.",
                "recommendation": "Review high-cost categories and enforce cost controls."
            })

        monthly_totals = (
            db.query(
                extract("month", Expense.date),
                func.sum(Expense.amount)
            )
            .group_by(extract("month", Expense.date))
            .all()
        )

        if monthly_totals:
            avg_monthly = total_spend / len(monthly_totals)

            for month, amount in monthly_totals:
                deviation = abs(float(amount) - avg_monthly) / avg_monthly
                if deviation > 0.25:
                    insights.append({
                        "level": "info",
                        "title": "Spending Volatility Detected",
                        "message": f"Unusual spending pattern detected in month {int(month)}.",
                        "recommendation": "Review transactions for seasonal or one-time expenses."
                    })
                    break

        return {"insights": insights}

    finally:
        db.close()
