# API Documentation

This document provides detailed information about the Task Manager API endpoints.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All API endpoints (except login and register) require authentication using JWT tokens.

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

## Error Responses

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Endpoints

### Authentication

#### Register User

```http
POST /auth/register
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

#### Login User

```http
POST /auth/login
```

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

### Tasks

#### Get All Tasks

```http
GET /tasks
```

Query Parameters:
- `status` - Filter by status (optional)
- `priority` - Filter by priority (optional)
- `sort` - Sort field (optional)
- `order` - Sort order (asc/desc, optional)

Response:
```json
{
  "tasks": [
    {
      "id": "task-id",
      "title": "Task Title",
      "description": "Task Description",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-03-25T00:00:00.000Z",
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### Get Task by ID

```http
GET /tasks/:id
```

Response:
```json
{
  "task": {
    "id": "task-id",
    "title": "Task Title",
    "description": "Task Description",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-03-25T00:00:00.000Z",
    "createdAt": "2024-03-20T00:00:00.000Z",
    "updatedAt": "2024-03-20T00:00:00.000Z"
  }
}
```

#### Create Task

```http
POST /tasks
```

Request Body:
```json
{
  "title": "New Task",
  "description": "Task Description",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-03-25T00:00:00.000Z"
}
```

Response:
```json
{
  "task": {
    "id": "task-id",
    "title": "New Task",
    "description": "Task Description",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-03-25T00:00:00.000Z",
    "createdAt": "2024-03-20T00:00:00.000Z",
    "updatedAt": "2024-03-20T00:00:00.000Z"
  }
}
```

#### Update Task

```http
PUT /tasks/:id
```

Request Body:
```json
{
  "title": "Updated Task",
  "description": "Updated Description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2024-03-26T00:00:00.000Z"
}
```

Response:
```json
{
  "task": {
    "id": "task-id",
    "title": "Updated Task",
    "description": "Updated Description",
    "status": "in-progress",
    "priority": "medium",
    "dueDate": "2024-03-26T00:00:00.000Z",
    "createdAt": "2024-03-20T00:00:00.000Z",
    "updatedAt": "2024-03-20T00:00:00.000Z"
  }
}
```

#### Delete Task

```http
DELETE /tasks/:id
```

Response:
```json
{
  "message": "Task deleted successfully"
}
```

### Users

#### Get User Profile

```http
GET /users/profile
```

Response:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-03-20T00:00:00.000Z",
    "updatedAt": "2024-03-20T00:00:00.000Z"
  }
}
```

#### Update User Profile

```http
PUT /users/profile
```

Request Body:
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

Response:
```json
{
  "user": {
    "id": "user-id",
    "email": "updated@example.com",
    "name": "Updated Name",
    "createdAt": "2024-03-20T00:00:00.000Z",
    "updatedAt": "2024-03-20T00:00:00.000Z"
  }
}
```

#### Change Password

```http
PUT /users/password
```

Request Body:
```json
{
  "currentPassword": "current-password",
  "newPassword": "new-password"
}
```

Response:
```json
{
  "message": "Password updated successfully"
}
```

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Pagination

List endpoints support pagination using query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

Example:
```http
GET /tasks?page=2&limit=20
```

## Filtering

List endpoints support filtering using query parameters:
- `status` - Task status
- `priority` - Task priority
- `dueDate` - Due date range
- `createdAt` - Creation date range

Example:
```http
GET /tasks?status=pending&priority=high
```

## Sorting

List endpoints support sorting using query parameters:
- `sort` - Field to sort by
- `order` - Sort order (asc/desc)

Example:
```http
GET /tasks?sort=dueDate&order=asc
```

## WebSocket Events

### Task Events

- `task:created` - Emitted when a task is created
- `task:updated` - Emitted when a task is updated
- `task:deleted` - Emitted when a task is deleted

### User Events

- `user:updated` - Emitted when a user profile is updated

## WebSocket Connection

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'jwt-token'
  }
});

socket.on('task:created', (task) => {
  console.log('New task created:', task);
});

socket.on('task:updated', (task) => {
  console.log('Task updated:', task);
});

socket.on('task:deleted', (taskId) => {
  console.log('Task deleted:', taskId);
});
```

## API Versioning

The API is versioned using the URL path:
```
/api/v1/...
```

## Response Time

- Average response time: < 100ms
- 95th percentile: < 200ms
- 99th percentile: < 500ms

## Error Handling

### Validation Errors

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Authentication Errors

```json
{
  "error": {
    "message": "Invalid credentials",
    "code": "INVALID_CREDENTIALS"
  }
}
```

### Authorization Errors

```json
{
  "error": {
    "message": "Access denied",
    "code": "ACCESS_DENIED"
  }
}
```

## Best Practices

1. Always include the `Authorization` header for authenticated requests
2. Handle rate limiting by implementing exponential backoff
3. Use pagination for large datasets
4. Implement proper error handling
5. Cache responses when appropriate
6. Use WebSocket for real-time updates 