# Solution Hub API Requirements

## Purpose
Define the expected contract for the Solution Hub so the frontend can integrate with a real backend without duplicating data models or creating a separate solution system.

## Suggested endpoints

### Solutions catalogue
- `GET /api/v1/solutions`
  - Returns all solution definitions with id, slug, title, category, description, capabilities, and featured status.
- `GET /api/v1/solutions/{id}`
  - Returns one module definition and its detail metadata.
- `GET /api/v1/solutions/categories`
  - Returns category definitions and labels used by filters.
- `GET /api/v1/solutions/featured`
  - Returns the featured solutions used on the dashboard and hub.

### User-specific solution views
- `GET /api/v1/solutions/my-active`
  - Returns active modules for the expert or workspace.
- `GET /api/v1/solutions/recently-used`
  - Returns recently opened solutions for quick navigation.

### Engagement integration
- `POST /api/v1/engagements`
  - Accepts a customer, solution context, business problem, requirements, and other engagement details.
- `GET /api/v1/customers`
  - Returns customers for engagement creation.

## Response shape example
```json
{
  "id": "procureiq",
  "slug": "procureiq",
  "title": "ProcureIQ",
  "category": "Procurement",
  "description": "Vendor discovery and procurement workflow support",
  "capabilities": ["Vendor discovery", "RFQ generation"],
  "featured": true,
  "active": true
}
```

## Notes
- The frontend implementation keeps solution data modular and config-driven so it can be replaced with live backend responses without reworking the display layer.
- The current app remains demo-ready and local-state driven until the backend provides these endpoints.
