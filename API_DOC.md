# API Documentation

School Equipment Lending Portal - Complete API Reference

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

---

## Authentication Endpoints

### 1. User Registration
**POST** `/auth/register`

Register a new user account.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
\`\`\`

**Parameters:**
- `name` (string, required): User's full name
- `email` (string, required): Unique email address
- `password` (string, required): Minimum 6 characters
- `role` (string, required): One of `student`, `staff`, `admin`

**Response (201):**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "jwt_token_here"
}
\`\`\`

**Errors:**
- 400: Missing required fields or invalid email format
- 409: Email already registered
- 500: Server error

---

### 2. User Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Parameters:**
- `email` (string, required): Registered email
- `password` (string, required): User password

**Response (200):**
\`\`\`json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
\`\`\`

**Errors:**
- 400: Missing email or password
- 401: Invalid credentials
- 404: User not found
- 500: Server error

---

### 3. Get Profile
**GET** `/auth/profile`

Retrieve current user profile.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

**Errors:**
- 401: No token or invalid token
- 404: User not found
- 500: Server error

---

## Equipment Endpoints

### 1. Get All Equipment
**GET** `/equipment`

List all available equipment with filters and search.

**Query Parameters:**
- `search` (string, optional): Search by name
- `category` (string, optional): Filter by category
- `condition` (string, optional): Filter by condition
- `page` (number, optional): Pagination page (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response (200):**
\`\`\`json
[
  {
    "id": "equipment_id",
    "name": "Basketball",
    "category": "sports",
    "condition": "excellent",
    "quantity": 10,
    "availableQuantity": 8,
    "description": "High-quality basketballs",
    "createdBy": {
      "id": "admin_id",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "lastMaintenanceDate": "2024-01-15T00:00:00Z"
  }
]
\`\`\`

**Errors:**
- 500: Server error

---

### 2. Get Equipment By ID
**GET** `/equipment/:id`

Retrieve specific equipment details.

**Path Parameters:**
- `id` (string, required): Equipment ID

**Response (200):**
\`\`\`json
{
  "id": "equipment_id",
  "name": "Basketball",
  "category": "sports",
  "condition": "excellent",
  "quantity": 10,
  "availableQuantity": 8,
  "description": "High-quality basketballs",
  "createdBy": { ... },
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

**Errors:**
- 404: Equipment not found
- 500: Server error

---

### 3. Create Equipment
**POST** `/equipment`

Add new equipment to inventory. **Admin only**.

**Headers:**
\`\`\`
Authorization: Bearer <admin_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "Basketball",
  "category": "sports",
  "condition": "excellent",
  "quantity": 10,
  "description": "High-quality basketballs",
  "lastMaintenanceDate": "2024-01-15T00:00:00Z"
}
\`\`\`

**Parameters:**
- `name` (string, required): Equipment name
- `category` (string, required): One of `sports`, `lab`, `classroom`, `multimedia`, `library`, `other`
- `condition` (string, optional): One of `excellent`, `good`, `fair`, `poor` (default: `good`)
- `quantity` (number, required): Total quantity
- `description` (string, optional): Equipment description
- `lastMaintenanceDate` (date, optional): Last maintenance date

**Response (201):**
\`\`\`json
{
  "id": "equipment_id",
  "name": "Basketball",
  "category": "sports",
  "condition": "excellent",
  "quantity": 10,
  "availableQuantity": 10,
  "description": "High-quality basketballs",
  "createdBy": "admin_id",
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

**Errors:**
- 400: Missing required fields or invalid quantity
- 401: No token or invalid token
- 403: User is not admin
- 500: Server error

---

### 4. Update Equipment
**PUT** `/equipment/:id`

Update equipment details. **Admin only**.

**Headers:**
\`\`\`
Authorization: Bearer <admin_token>
\`\`\`

**Path Parameters:**
- `id` (string, required): Equipment ID

**Request Body:**
\`\`\`json
{
  "name": "Basketball",
  "category": "sports",
  "condition": "good",
  "quantity": 12,
  "description": "Updated description",
  "lastMaintenanceDate": "2024-01-20T00:00:00Z"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "equipment_id",
  "name": "Basketball",
  "category": "sports",
  "condition": "good",
  "quantity": 12,
  "availableQuantity": 10,
  "description": "Updated description",
  "lastMaintenanceDate": "2024-01-20T00:00:00Z"
}
\`\`\`

**Errors:**
- 400: Invalid data
- 401: No token or invalid token
- 403: User is not admin
- 404: Equipment not found
- 500: Server error

---

### 5. Delete Equipment
**DELETE** `/equipment/:id`

Remove equipment from inventory. **Admin only**.

**Headers:**
\`\`\`
Authorization: Bearer <admin_token>
\`\`\`

**Path Parameters:**
- `id` (string, required): Equipment ID

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Equipment deleted successfully"
}
\`\`\`

**Errors:**
- 401: No token or invalid token
- 403: User is not admin
- 404: Equipment not found
- 500: Server error

---

## Request Endpoints

### 1. Get Requests
**GET** `/requests`

List borrowing requests. Students see only their requests, admins/staff see all.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Query Parameters:**
- `status` (string, optional): Filter by `pending`, `approved`, `rejected`, `returned`
- `userId` (string, optional): Filter by user (admin only)
- `equipmentId` (string, optional): Filter by equipment
- `page` (number, optional): Pagination page
- `limit` (number, optional): Items per page
- `sortBy` (string, optional): Sort field (requestDate, dueDate)
- `sortOrder` (string, optional): `asc` or `desc`

**Response (200):**
\`\`\`json
[
  {
    "id": "request_id",
    "requesterId": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "equipmentId": {
      "id": "equipment_id",
      "name": "Basketball",
      "category": "sports"
    },
    "quantity": 1,
    "status": "pending",
    "requestDate": "2024-01-01T00:00:00Z",
    "dueDate": "2024-01-08T00:00:00Z",
    "returnDate": null,
    "approvedBy": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "isOverdue": false
  }
]
\`\`\`

**Errors:**
- 401: No token or invalid token
- 500: Server error

---

### 2. Get Request By ID
**GET** `/requests/:id`

Retrieve specific request details.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Path Parameters:**
- `id` (string, required): Request ID

**Response (200):**
\`\`\`json
{
  "id": "request_id",
  "requesterId": { ... },
  "equipmentId": { ... },
  "quantity": 1,
  "status": "pending",
  "requestDate": "2024-01-01T00:00:00Z",
  "dueDate": "2024-01-08T00:00:00Z",
  "returnDate": null,
  "approvedBy": null
}
\`\`\`

**Errors:**
- 401: No token or invalid token
- 403: Not authorized to view this request
- 404: Request not found
- 500: Server error

---

### 3. Create Request
**POST** `/requests`

Submit new borrowing request. **Student/Staff only**.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "equipmentId": "equipment_id",
  "quantity": 2,
  "dueDate": "2024-01-08T00:00:00Z"
}
\`\`\`

**Parameters:**
- `equipmentId` (string, required): Equipment ID to request
- `quantity` (number, optional): Quantity requested (default: 1)
- `dueDate` (date, required): Expected return date

**Response (201):**
\`\`\`json
{
  "id": "request_id",
  "requesterId": "user_id",
  "equipmentId": "equipment_id",
  "quantity": 2,
  "status": "pending",
  "requestDate": "2024-01-01T00:00:00Z",
  "dueDate": "2024-01-08T00:00:00Z",
  "returnDate": null,
  "approvedBy": null
}
\`\`\`

**Errors:**
- 400: Missing fields or insufficient available quantity
- 401: No token or invalid token
- 403: User is admin
- 404: Equipment not found
- 409: Overlapping request detected
- 500: Server error

---

### 4. Update Request Status
**PUT** `/requests/:id`

Approve, reject, or mark request as returned. **Admin/Staff only**.

**Headers:**
\`\`\`
Authorization: Bearer <admin_token>
\`\`\`

**Path Parameters:**
- `id` (string, required): Request ID

**Request Body:**
\`\`\`json
{
  "status": "approved",
  "approvedBy": "admin_id"
}
\`\`\`

**Parameters:**
- `status` (string, required): One of `pending`, `approved`, `rejected`, `returned`
- `approvedBy` (string, optional): ID of approving admin/staff

**Response (200):**
\`\`\`json
{
  "id": "request_id",
  "requesterId": "user_id",
  "equipmentId": "equipment_id",
  "quantity": 2,
  "status": "approved",
  "requestDate": "2024-01-01T00:00:00Z",
  "dueDate": "2024-01-08T00:00:00Z",
  "returnDate": null,
  "approvedBy": "admin_id"
}
\`\`\`

**Errors:**
- 400: Invalid status or missing fields
- 401: No token or invalid token
- 403: User is not admin/staff
- 404: Request not found
- 500: Server error

---

## Notification Endpoints

### 1. Get Notifications
**GET** `/notifications`

Retrieve user notifications with filtering options.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Query Parameters:**
- `unreadOnly` (boolean, optional): Show only unread notifications
- `type` (string, optional): Filter by notification type
- `limit` (number, optional): Number of notifications (default: 10)

**Response (200):**
\`\`\`json
[
  {
    "id": "notification_id",
    "userId": "user_id",
    "requestId": "request_id",
    "type": "overdue-alert",
    "title": "Equipment Overdue",
    "message": "Your basketball request is now 2 days overdue",
    "isRead": false,
    "daysUntilDue": -2,
    "createdAt": "2024-01-10T00:00:00Z"
  }
]
\`\`\`

**Errors:**
- 401: No token or invalid token
- 500: Server error

---

### 2. Mark Notification as Read
**PUT** `/notifications/:id`

Mark a notification as read.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Path Parameters:**
- `id` (string, required): Notification ID

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Notification marked as read"
}
\`\`\`

**Errors:**
- 401: No token or invalid token
- 404: Notification not found
- 500: Server error

---

### 3. Check Overdue Equipment
**POST** `/notifications/check-overdue`

Trigger overdue check and create notifications. **Admin only**.

**Headers:**
\`\`\`
Authorization: Bearer <admin_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Overdue check completed",
  "overdueCount": 5,
  "notificationsCreated": 5
}
\`\`\`

**Errors:**
- 401: No token or invalid token
- 403: User is not admin
- 500: Server error

---

## User Management Endpoints (Admin Only)

### 1. Get All Users
**GET** `/users`

List all users. **Admin only**.

**Headers:**
\`\`\`
Authorization: Bearer <admin_token>
\`\`\`

**Query Parameters:**
- `role` (string, optional): Filter by role
- `status` (string, optional): Filter by active/inactive
- `search` (string, optional): Search by name or email
- `page` (number, optional): Pagination page
- `limit` (number, optional): Items per page

**Response (200):**
\`\`\`json
[
  {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
\`\`\`

---

### 2. Get User By ID
**GET** `/users/:id`

Retrieve specific user details. **Admin only**.

**Headers:**
\`\`\`
Authorization: Bearer <admin_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

---

### 3. Update User
**PUT** `/users/:id`

Update user information. **Admin only**.

**Headers:**
\`\`\`
Authorization: Bearer <admin_token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "Jane Doe",
  "role": "staff",
  "status": "active"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "user_id",
  "name": "Jane Doe",
  "email": "john@example.com",
  "role": "staff",
  "status": "active"
}
\`\`\`

---

### 4. Deactivate User
**DELETE** `/users/:id`

Deactivate user account. **Admin only**.

**Headers:**
\`\`\`
Authorization: Bearer <admin_token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "User deactivated successfully"
}
\`\`\`

**Note:** Cannot delete active admin accounts to prevent lockout.

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

## Rate Limiting

Currently no rate limiting. Consider implementing for production:
- 100 requests per minute for authenticated users
- 30 requests per minute for unauthenticated endpoints

## Pagination

Most list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes `total`, `page`, `pages` fields.

\`\`\`json
{
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
