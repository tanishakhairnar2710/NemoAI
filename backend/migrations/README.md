# Migrations

The application currently creates SQLite tables through SQLAlchemy metadata on startup.

For PostgreSQL or team deployments, add Alembic here and point `DATABASE_URL` at the target database:

```bash
alembic init backend/migrations
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```
