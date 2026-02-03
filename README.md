# Smart Expense Management System

## Requirements
- Python 3.10+
- Node.js 18+
- PostgreSQL

## VS Code Setup
1. Open VS Code
2. File → Open Folder → select `smart-expense-management`
3. Open terminal inside VS Code

## Database Setup
```sql
CREATE DATABASE expense_db;
```
Run `database/schema.sql` inside pgAdmin.

## Backend Setup
```bash
cd backend
pip install -r ../requirements.txt
uvicorn app.main:app --reload
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Backend runs on http://localhost:8000  
Frontend runs on http://localhost:5173
