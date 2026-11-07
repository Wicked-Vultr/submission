# API Documentation

## Base URL
`/api/v1`

## Health
- GET `/health`
- GET `/api/v1/health`

## Auth
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- GET `/api/v1/auth/me`

## Customers
- GET `/api/v1/customers`
- POST `/api/v1/customers`
- GET `/api/v1/customers/{customer_id}`

## Engagements
- GET `/api/v1/engagements`
- POST `/api/v1/engagements`
- GET `/api/v1/engagements/{engagement_id}`
- POST `/api/v1/engagements/{engagement_id}/scope/analyze`
- GET `/api/v1/engagements/{engagement_id}/scope`
- POST `/api/v1/engagements/{engagement_id}/research`
- GET `/api/v1/engagements/{engagement_id}/research/jobs`

## Research
- GET `/api/v1/research/{job_id}`
- GET `/api/v1/research/{job_id}/findings`
- POST `/api/v1/research/{job_id}/cancel`

## Recommendations
- POST `/api/v1/engagements/{engagement_id}/recommendations`
- GET `/api/v1/engagements/{engagement_id}/recommendations`

## Roadmaps
- POST `/api/v1/engagements/{engagement_id}/roadmaps`
- GET `/api/v1/engagements/{engagement_id}/roadmaps`

## Procurement
- POST `/api/v1/procurement/requests`
- GET `/api/v1/procurement/requests/{request_id}`

## Authentication
Authorization is currently implemented with a bearer token generated from the login endpoint. The backend uses JWT-based access tokens with HS256.
