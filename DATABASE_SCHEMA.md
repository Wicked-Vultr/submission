# Database Schema

## Core tables
- workspaces
- users
- customers
- engagements
- engagement_scopes
- research_jobs
- findings
- recommendations
- roadmap_items
- approvals
- vendors
- procurement_requests

## Notes
- UUID-based identifiers are used for core entities.
- Timestamp fields are included for created_at and updated_at where relevant.
- SQLite is used for local validation; PostgreSQL is the target production database.
