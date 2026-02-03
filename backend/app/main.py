from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import Base, engine
from .routers import upload, dashboard, budgets, insights, admin

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(upload.router, prefix="/upload")
app.include_router(dashboard.router, prefix="/dashboard")
app.include_router(budgets.router, prefix="/budgets")
app.include_router(insights.router, prefix="/insights")
app.include_router(admin.router, prefix="/admin")

@app.get("/")
def health():
    return {"status": "ok"}
