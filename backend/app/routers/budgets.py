from fastapi import APIRouter
from sqlalchemy import text
from ..database import SessionLocal

router = APIRouter()

@router.get("/vs-actual/")
def budget_vs_actual(month: int, year: int):
    db = SessionLocal()
    try:
        result = db.execute(
            text("""
                SELECT
                    SUM(b.monthly_budget) AS fixed_budget,
                    COALESCE(SUM(e.amount), 0) AS actual_spent
                FROM budgets b
                LEFT JOIN expenses e
                    ON EXTRACT(MONTH FROM e.date) = :month
                    AND EXTRACT(YEAR FROM e.date) = :year
                WHERE b.month = :month
                  AND b.year = :year
            """),
            {"month": month, "year": year}
        ).mappings().one()

        return result
    finally:
        db.close()
