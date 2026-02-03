from sqlalchemy import Column, Integer, String, Float, Date
from .database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    vendor = Column(String, nullable=False)
    department = Column(String, nullable=False)
    payment_mode = Column(String, nullable=False)


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True)
    category = Column(String, nullable=False)
    department = Column(String, nullable=True)
    monthly_budget = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
