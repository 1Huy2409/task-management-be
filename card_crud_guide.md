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

### 5. Reorder Card (Move Card)
Change position of a card or move it to another list.

- **URL**: `PATCH /cards/:id`
- **Auth**: Required
- **Permission**: `card:update`
- **Body**:
```json
{
  "listId": "uuid-of-target-list", // Optional: Move to another list
  "position": 5000.5 // Optional: New position (decimal allowed for insertion)
}
```
- **Response**: `200 OK`

### 6. Delete Card
Remove a card permanently.

- **URL**: `DELETE /cards/:id`
- **Auth**: Required
- **Permission**: `card:delete`
- **Response**: `200 OK`

## Reorder Mechanism (Fractional Indexing)

The system uses **Fractional Indexing** to determine the order of cards. The `position` field is a decimal number (float).
When moving a card, the frontend should calculate the new position based on the surrounding cards and send it to the `PATCH /cards/:id` API.

**Formula:**
- **Insert between A and B**: `newIdentifier = (positionA + positionB) / 2`
- **Insert at top**: `newIdentifier = positionFirst / 2`
- **Insert at bottom**: `newIdentifier = positionLast + 1000` (or any increment)

**Example:**
Existing positions: `[1000, 2000, 3000]`
- Move to top: `1000 / 2 = 500`
- Move between 1000 and 2000: `(1000 + 2000) / 2 = 1500`
- Move to bottom: `3000 + 1000 = 4000`


### 6. Assign Member
Assign a user to a card.

- **URL**: `POST /cards/:id/members`
- **Auth**: Required
- **Permission**: `card:assign`
- **Body**:
```json
{
  "userId": "uuid-of-user"
}
```
- **Response**: `200 OK`

### 7. Remove Member
Remove a user from a card.

- **URL**: `DELETE /cards/:id/members/:userId`
- **Auth**: Required
- **Permission**: `card:assign`
- **Response**: `200 OK`


**Create:**
```bash
curl -X POST http://localhost:3000/api/v1/cards \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Card", "listId": "YOUR_LIST_ID"}'
```

### 8. Create Checklist
Create a new checklist in a card.

- **URL**: `POST /checklists`
- **Auth**: Required
- **Permission**: `card:update`
- **Body**:
```json
{
  "title": "To Do",
  "cardId": "uuid-of-card"
}
```
- **Response**: `201 Created`

### 9. Delete Checklist
Delete a checklist.

- **URL**: `DELETE /checklists/:id`
- **Auth**: Required
- **Permission**: `card:update`
- **Response**: `200 OK`

### 10. Create Checklist Item
Add an item to a checklist.

- **URL**: `POST /checklists/:id/items`
- **Auth**: Required
- **Permission**: `card:update`
- **Body**:
```json
{
  "title": "Buy milk"
}
```
- **Response**: `201 Created`

### 11. Update Checklist Item
Update item details (e.g., toggle check, rename).

- **URL**: `PATCH /checklists/items/:id`
- **Auth**: Required
- **Permission**: `card:update`
- **Body**:
```json
{
  "title": "Buy almond milk",
  "isChecked": true
}
```
- **Response**: `200 OK`

### 12. Delete Checklist Item
Remove an item from a checklist.

- **URL**: `DELETE /checklists/items/:id`
- **Auth**: Required
- **Permission**: `card:update`
- **Response**: `200 OK`


## Setup & Run Instructions

After pulling this code, follow these steps to get the backend running with the new Card & Checklist features:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Ensure your `.env` file is configured (Database, JWT, Redis, etc.).

3.  **Run Migrations**:
    Apply the database schema changes for Cards and Checklists.
    ```bash
    npm run migration:run
    ```

4.  **Start Server**:
    ```bash
    npm run dev
    ```

5.  **Verify**:
    - Access Swagger Documentation: `http://localhost:8000/api-docs`
    - Run Verification Tests: `npm run test src/apis/card/card.flow.test.ts`


