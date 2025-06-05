# Ragster Backend

A FastAPI backend with SQLAlchemy, supporting RBAC and department modules, connected to a PostgreSQL database.

## Features

- Modular API structure (v1, department, RBAC)
- SQLAlchemy ORM for PostgreSQL
- Environment-based configuration using dotenv
- Role-based access control (RBAC)

## Setup

1. Create a `.env` file in the project root with your DB and secret settings (see `.env.example`).
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the app:
   ```bash
   uvicorn app.main:app --reload
   ```
