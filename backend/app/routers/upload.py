from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from sqlalchemy.exc import SQLAlchemyError
from ..database import SessionLocal
from ..models import Expense

router = APIRouter(tags=["Upload"])

REQUIRED_COLUMNS = {
    "Date", "Amount", "Category",
    "Vendor", "Department", "PaymentMode"
}

@router.post("/")
async def upload_excel(file: UploadFile = File(...)):
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Only Excel files allowed")

    try:
        df = pd.read_excel(file.file)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Excel file")

    missing_cols = REQUIRED_COLUMNS - set(df.columns)
    if missing_cols:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {', '.join(missing_cols)}"
        )

    df = df.map(lambda x: x.strip() if isinstance(x, str) else x)
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df["Amount"] = pd.to_numeric(df["Amount"], errors="coerce")

    db = SessionLocal()
    inserted = 0

    try:
        for _, row in df.iterrows():
            if pd.isna(row["Date"]) or pd.isna(row["Amount"]) or row["Amount"] <= 0:
                continue

            db.add(Expense(
                date=row["Date"].date(),
                amount=float(row["Amount"]),
                category=str(row["Category"]),
                vendor=str(row["Vendor"]),
                department=str(row["Department"]),
                payment_mode=str(row["PaymentMode"])
            ))
            inserted += 1

        db.commit()

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error during upload")

    finally:
        db.close()

    return {
        "status": "success",
        "rows_inserted": inserted
    }
