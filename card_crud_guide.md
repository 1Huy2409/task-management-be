# Card CRUD API Guide

This document describes the Card management APIs implemented in the system.

## Base URL
`/api/v1/cards` (Assuming `/api/v1` prefix from main app, or just `/cards` if mounted at root - check `index.ts`. Based on `index.router.ts`, it is just `/cards` relative to the main router mount point).
If `index.ts` mounts main router at `/api/v1`, then `/api/v1/cards`.

## Endpoints

### 1. Create Card
Create a new card in a specific list.

- **URL**: `POST /cards`
- **Auth**: Required
- **Permission**: `card:create` (checked on the Board of the List)
- **Body**:
```json
{
  "title": "My New Task",
  "listId": "uuid-of-list",
  "description": "Details about the task",
  "priority": "medium", // low, medium, high
  "dueDate": "2023-12-31T23:59:59Z",
  "coverUrl": "https://example.com/image.png"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Create card successfully",
  "data": {
    "id": "uuid-of-card",
    "title": "My New Task",
    "position": 1000,
    ...
  }
}
```

### 2. Get All Cards (in a List)
Get all cards belonging to a list.

- **URL**: `GET /cards?listId=uuid-of-list`
- **Auth**: Required
- **Permission**: `card:view` (checked on the Board of the List)
- **Query Params**: `listId` (Required)
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [ ... ]
}
```

### 3. Get Card by ID
Get details of a specific card.

- **URL**: `GET /cards/:id`
- **Auth**: Required
- **Permission**: `card:view` (checked on the Board of the Card)
- **Response**: `200 OK`

### 4. Update Card
Update card details, including moving to another list or reordering.

- **URL**: `PATCH /cards/:id`
- **Auth**: Required
- **Permission**: `card:update`
- **Body** (Partial):
```json
{
  "title": "Updated Title",
  "description": "Updated details",
  "priority": "high",
  "listId": "uuid-of-target-list", // Move to another list
  "position": 2000 // Reorder
}
```
- **Response**: `200 OK`

### 5. Delete Card
Remove a card permanently.

- **URL**: `DELETE /cards/:id`
- **Auth**: Required
- **Permission**: `card:delete`
- **Response**: `200 OK`

## Testing (cURL Examples)

**Create:**
```bash
curl -X POST http://localhost:3000/api/v1/cards \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Card", "listId": "YOUR_LIST_ID"}'
```

**Get All:**
```bash
curl -X GET "http://localhost:3000/api/v1/cards?listId=YOUR_LIST_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
