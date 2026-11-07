# Vultr Deployment Guide

## Prerequisites
- Vultr Cloud Compute VM
- Docker and Docker Compose
- PostgreSQL and Redis
- Environment variables for app secret, DB, and inference settings

## Planned production setup
1. Containerize the FastAPI app.
2. Configure Postgres and Redis services.
3. Run Alembic migrations.
4. Provision an inference provider via Vultr Serverless Inference.
5. Reverse proxy via Nginx and HTTPS termination.
6. Configure health checks and log retention.

## Notes
This repository currently includes the application code and local validation foundation, but full Vultr deployment automation remains a follow-up task.
