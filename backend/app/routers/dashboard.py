from fastapi import APIRouter
from sqlalchemy import func, extract
from ..database import SessionLocal
from ..models import Expense

router = APIRouter(tags=["Dashboard"])


@router.get("/overview")
def overview():
    db = SessionLocal()
    try:
        total_spend = db.query(func.sum(Expense.amount)).scalar() or 0
        transactions = db.query(func.count(Expense.id)).scalar() or 0

        monthly_totals = (
            db.query(func.sum(Expense.amount).label("total"))
            .group_by(extract("month", Expense.date))
            .all()
        )

        monthly_burn = (
            sum(float(m.total) for m in monthly_totals) / len(monthly_totals)
            if monthly_totals else 0
        )

        return {
            "total_spend": round(float(total_spend), 2),
            "transactions": int(transactions),
            "monthly_burn": round(float(monthly_burn), 2)
        }
    finally:
        db.close()


@router.get("/monthly-trend")
def monthly_trend():
    db = SessionLocal()
    try:
        rows = (
            db.query(
                extract("month", Expense.date).label("month"),
                func.sum(Expense.amount).label("amount")
            )
            .group_by("month")
            .order_by("month")
            .all()
        )

        month_map = {
            1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
            5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
            9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
        }

        data = {int(m): float(a) for m, a in rows}

        return [
            {"month": month_map[i], "amount": round(data.get(i, 0), 2)}
            for i in range(1, 13)
        ]
    finally:
        db.close()


@router.get("/category-distribution")
def category_distribution():
    db = SessionLocal()
    try:
        rows = (
            db.query(
                Expense.category,
                func.sum(Expense.amount).label("amount")
            )
            .group_by(Expense.category)
            .order_by(func.sum(Expense.amount).desc())
            .all()
        )

        return [
            {"category": c, "amount": round(float(a), 2)}
            for c, a in rows
        ]
    finally:
        db.close()


@router.get("/vendor-comparison")
def vendor_comparison():
    db = SessionLocal()
    try:
        rows = (
            db.query(
                Expense.vendor,
                func.sum(Expense.amount).label("amount")
            )
            .group_by(Expense.vendor)
            .order_by(func.sum(Expense.amount).desc())
            .all()
        )

        return [
            {"vendor": v, "amount": round(float(a), 2)}
            for v, a in rows
        ]
    finally:
        db.close()


@router.get("/yearly-budget-vs-actual")
def yearly_budget_vs_actual(year: int):
    db = SessionLocal()
    try:
        total = (
            db.query(func.sum(Expense.amount))
            .filter(extract("year", Expense.date) == year)
            .scalar()
            or 0
        )

        return {
            "year": year,
            "fixed_budget": 1_200_000,
            "actual_spent": round(float(total), 2)
        }
    finally:
        db.close()
