# Database Schema

School Equipment Lending Portal - MongoDB Collections Schema

## Collections Overview

- **Users**: System user accounts with roles
- **Equipment**: Inventory items available for borrowing
- **Requests**: Borrowing requests from users
- **Notifications**: System notifications for users

---

## User Collection

Stores user account information with authentication credentials.

**Collection Name:** `users`

**Schema:**
\`\`\`javascript
{
  _id: ObjectId,
  name: String (required, max 100),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcryptjs),
  role: String (enum: ["student", "staff", "admin"], default: "student"),
  status: String (enum: ["active", "inactive"], default: "active"),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
\`\`\`

**Fields:**
- `_id`: Unique identifier (ObjectId)
- `name`: User's full name (100 chars max)
- `email`: Unique email address, automatically lowercased
- `password`: Hashed password using bcryptjs (never stored in plain text)
- `role`: User role determining access level
  - `student`: Can view equipment and make borrowing requests
  - `staff`: Can view all requests and approve/reject
  - `admin`: Full system access including user and equipment management
- `status`: Account status
  - `active`: User can login and use system
  - `inactive`: User account is deactivated
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

**Indexes:**
\`\`\`javascript
{
  email: 1 (unique),
  role: 1,
  status: 1,
  createdAt: -1
}
\`\`\`

**Example Document:**
\`\`\`json
{
  "_id": ObjectId("60d5ec49c1234567890abcde"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...",
  "role": "student",
  "status": "active",
  "createdAt": ISODate("2024-01-01T08:00:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
\`\`\`

---

## Equipment Collection

Stores school equipment inventory with availability tracking.

**Collection Name:** `equipment`

**Schema:**
\`\`\`javascript
{
  _id: ObjectId,
  name: String (required, max 200),
  category: String (required, enum: [...]),
  condition: String (enum: ["excellent", "good", "fair", "poor"], default: "good"),
  quantity: Number (required, min: 1),
  availableQuantity: Number (required, min: 0),
  description: String (max: 1000),
  createdBy: ObjectId (ref: User),
  lastMaintenanceDate: Date,
  status: String (enum: ["available", "maintenance", "archived"], default: "available"),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
\`\`\`

**Fields:**
- `_id`: Unique equipment identifier
- `name`: Equipment name (max 200 chars)
- `category`: Equipment category:
  - `sports`: Sports equipment (balls, bats, etc.)
  - `lab`: Laboratory equipment
  - `classroom`: Classroom supplies
  - `multimedia`: Audio/video equipment
  - `library`: Library materials
  - `other`: Miscellaneous items
- `condition`: Current physical condition
  - `excellent`: Like new, fully functional
  - `good`: Functional, minor wear
  - `fair`: Functional with some damage
  - `poor`: Needs repair/maintenance
- `quantity`: Total items in inventory
- `availableQuantity`: Currently available items (0 to quantity)
- `description`: Detailed equipment description
- `createdBy`: Reference to admin user who created entry
- `lastMaintenanceDate`: Last maintenance/repair date
- `status`: Equipment status
  - `available`: Ready for borrowing
  - `maintenance`: Currently being serviced
  - `archived`: No longer in use
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp

**Constraints:**
- `availableQuantity` ≤ `quantity`
- `availableQuantity` ≥ 0
- `quantity` ≥ 1

**Indexes:**
\`\`\`javascript
{
  name: 1,
  category: 1,
  status: 1,
  condition: 1,
  createdBy: 1,
  createdAt: -1
}
\`\`\`

**Example Document:**
\`\`\`json
{
  "_id": ObjectId("60d5ec49c1234567890abcde"),
  "name": "Basketball",
  "category": "sports",
  "condition": "excellent",
  "quantity": 10,
  "availableQuantity": 8,
  "description": "Official size basketballs, high quality",
  "createdBy": ObjectId("60d5ec49c1234567890abcd1"),
  "lastMaintenanceDate": ISODate("2024-01-15T00:00:00.000Z"),
  "status": "available",
  "createdAt": ISODate("2024-01-01T08:00:00.000Z"),
  "updatedAt": ISODate("2024-01-16T10:30:00.000Z")
}
\`\`\`

---

## Request Collection

Tracks all borrowing requests from users.

**Collection Name:** `requests`

**Schema:**
\`\`\`javascript
{
  _id: ObjectId,
  requesterId: ObjectId (ref: User, required),
  equipmentId: ObjectId (ref: Equipment, required),
  quantity: Number (required, min: 1),
  status: String (enum: ["pending", "approved", "rejected", "returned"], default: "pending"),
  requestDate: Date (default: now),
  dueDate: Date (required),
  returnDate: Date (default: null),
  approvedBy: ObjectId (ref: User, default: null),
  rejectionReason: String (max: 500),
  notes: String (max: 1000),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
\`\`\`

**Fields:**
- `_id`: Unique request identifier
- `requesterId`: Reference to user making request
- `equipmentId`: Reference to equipment being requested
- `quantity`: Number of items requested (must be ≤ availableQuantity)
- `status`: Request status
  - `pending`: Awaiting approval from admin/staff
  - `approved`: Approved, equipment issued to user
  - `rejected`: Request denied
  - `returned`: Equipment has been returned
- `requestDate`: When request was submitted
- `dueDate`: Expected return date (must be in future)
- `returnDate`: Actual return date (null until marked returned)
- `approvedBy`: Reference to admin/staff who approved request
- `rejectionReason`: Reason for rejection (if applicable)
- `notes`: Additional notes about request
- `createdAt`: Timestamp when request was created
- `updatedAt`: Last modification timestamp

**Constraints:**
- `dueDate` > current date
- Cannot create overlapping requests for same equipment from same user
- `quantity` ≤ equipment's `availableQuantity` at approval time

**Indexes:**
\`\`\`javascript
{
  requesterId: 1,
  equipmentId: 1,
  status: 1,
  requestDate: -1,
  dueDate: 1,
  createdAt: -1
}
\`\`\`

**Example Document:**
\`\`\`json
{
  "_id": ObjectId("60d5ec49c1234567890abcde"),
  "requesterId": ObjectId("60d5ec49c1234567890abc01"),
  "equipmentId": ObjectId("60d5ec49c1234567890abcde"),
  "quantity": 2,
  "status": "approved",
  "requestDate": ISODate("2024-01-01T08:00:00.000Z"),
  "dueDate": ISODate("2024-01-08T23:59:59.000Z"),
  "returnDate": null,
  "approvedBy": ObjectId("60d5ec49c1234567890abc02"),
  "rejectionReason": null,
  "notes": "For PE class",
  "createdAt": ISODate("2024-01-01T08:00:00.000Z"),
  "updatedAt": ISODate("2024-01-02T10:30:00.000Z")
}
\`\`\`

---

## Notification Collection

Stores user notifications for events and reminders.

**Collection Name:** `notifications`

**Schema:**
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  requestId: ObjectId (ref: Request, required),
  type: String (required, enum: [...]),
  title: String (required, max: 100),
  message: String (required, max: 500),
  isRead: Boolean (default: false),
  daysUntilDue: Number (default: null),
  email: String (default: null),
  emailSent: Boolean (default: false),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
\`\`\`

**Fields:**
- `_id`: Unique notification identifier
- `userId`: Reference to recipient user
- `requestId`: Reference to related borrowing request
- `type`: Notification type
  - `due-date-reminder`: Equipment due soon (3 days before)
  - `overdue-alert`: Equipment past due date
  - `return-reminder`: Reminder to return equipment
  - `approved`: Request was approved
  - `rejected`: Request was rejected
- `title`: Notification title (max 100 chars)
- `message`: Full notification message (max 500 chars)
- `isRead`: Whether user has read notification
- `daysUntilDue`: Days until/past due date (negative if overdue)
- `email`: Email address for email notification
- `emailSent`: Whether email notification was sent
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp

**Indexes:**
\`\`\`javascript
{
  userId: 1,
  requestId: 1,
  type: 1,
  isRead: 1,
  createdAt: -1
}
\`\`\`

**Example Document:**
\`\`\`json
{
  "_id": ObjectId("60d5ec49c1234567890abcde"),
  "userId": ObjectId("60d5ec49c1234567890abc01"),
  "requestId": ObjectId("60d5ec49c1234567890abcaa"),
  "type": "overdue-alert",
  "title": "Equipment Overdue",
  "message": "Your basketball request is now 2 days overdue. Please return it immediately.",
  "isRead": false,
  "daysUntilDue": -2,
  "email": "john@example.com",
  "emailSent": true,
  "createdAt": ISODate("2024-01-10T08:00:00.000Z"),
  "updatedAt": ISODate("2024-01-10T08:00:00.000Z")
}
\`\`\`

---

## Data Relationships

\`\`\`
User (1) -----> (N) Equipment (created by admin)
           |
           v
         (N) Request (created by student/staff)
               |
               v----> (1) Equipment
               |
               v----> (1) User (approved by admin/staff)
               |
               v----> (N) Notification
\`\`\`

---

## Validation Rules

### Equipment
- `quantity` ≥ 1 and `availableQuantity` ≤ `quantity`
- `availableQuantity` cannot be less than 0
- When `quantity` decreases, `availableQuantity` is adjusted (cannot exceed new quantity)

### Request
- `quantity` requested must be ≤ available at time of creation
- `dueDate` must be in the future
- Cannot have overlapping active requests for same equipment
- When request approved, `equipment.availableQuantity` decreases
- When request rejected or returned, `equipment.availableQuantity` increases

### Notification
- Created automatically on request approval/rejection
- Overdue notifications created automatically via scheduled job
- Duplicate prevention for same request/type within 24 hours

---

## Aggregation Examples

### Find overdue equipment
\`\`\`javascript
db.requests.aggregate([
  {
    $match: {
      status: "approved",
      dueDate: { $lt: new Date() }
    }
  },
  {
    $lookup: {
      from: "equipment",
      localField: "equipmentId",
      foreignField: "_id",
      as: "equipment"
    }
  }
])
\`\`\`

### Equipment usage statistics
\`\`\`javascript
db.requests.aggregate([
  {
    $match: { status: { $in: ["approved", "returned"] } }
  },
  {
    $group: {
      _id: "$equipmentId",
      requestCount: { $sum: 1 },
      totalQuantity: { $sum: "$quantity" }
    }
  },
  {
    $lookup: {
      from: "equipment",
      localField: "_id",
      foreignField: "_id",
      as: "equipment"
    }
  }
])
\`\`\`

---

## MongoDB Atlas Configuration

**Recommended settings:**
- Cluster Tier: M0 (Free) for development, M2+ for production
- Backup: Daily snapshots (minimum)
- Indexes: Pre-create indexes listed above
- Connection String Format:
  \`\`\`
  mongodb+srv://username:password@cluster.mongodb.net/school-equipment?retryWrites=true&w=majority
