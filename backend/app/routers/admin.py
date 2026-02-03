from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from ..database import SessionLocal
from ..models import Expense

router = APIRouter(tags=["Admin"])

@router.delete("/reset/")
def reset_data():
    db = SessionLocal()
    try:
        db.query(Expense).delete()
        db.commit()
        return {"status": "success"}
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        db.close()
