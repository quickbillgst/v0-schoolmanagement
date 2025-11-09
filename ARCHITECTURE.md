# System Architecture

School Equipment Lending Portal - Complete System Design

## Overview

The School Equipment Lending Portal is built using a modern full-stack JavaScript architecture with Next.js, React, MongoDB, and Node.js. The system follows a client-server model with clear separation of concerns.

## Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│                   (Next.js App Router)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │ Components   │  │   Context    │      │
│  │ (Auth,       │  │ (UI, Forms)  │  │ (Auth, User) │      │
│  │  Dashboard)  │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                      │                                       │
└──────────────────────┼───────────────────────────────────────┘
                       │ HTTP/JSON
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼─────────────────────────────▼──────────┐
│          NEXT.JS API ROUTES                     │
│      (Route Handlers - Node.js Runtime)        │
├───────────────────────────────────────────────┤
│                                                │
│  ┌────────────────────────────────────────┐  │
│  │     Authentication Routes               │  │
│  │  /api/auth/register                     │  │
│  │  /api/auth/login                        │  │
│  │  /api/auth/profile                      │  │
│  └────────────────────────────────────────┘  │
│                                                │
│  ┌────────────────────────────────────────┐  │
│  │     Equipment Routes                    │  │
│  │  GET/POST /api/equipment                │  │
│  │  GET/PUT/DELETE /api/equipment/:id      │  │
│  └────────────────────────────────────────┘  │
│                                                │
│  ┌────────────────────────────────────────┐  │
│  │     Request Routes                      │  │
│  │  GET/POST /api/requests                 │  │
│  │  GET/PUT /api/requests/:id              │  │
│  └────────────────────────────────────────┘  │
│                                                │
│  ┌────────────────────────────────────────┐  │
│  │     Notification Routes                 │  │
│  │  GET /api/notifications                 │  │
│  │  PUT /api/notifications/:id             │  │
│  │  POST /api/notifications/check-overdue  │  │
│  └────────────────────────────────────────┘  │
│                                                │
│  ┌────────────────────────────────────────┐  │
│  │     User Management Routes (Admin)     │  │
│  │  GET /api/users                         │  │
│  │  GET/PUT /api/users/:id                 │  │
│  └────────────────────────────────────────┘  │
│                                                │
└───────────────────────────────────────────────┘
            │             │
    ┌───────▼─────────────▼──────────┐
    │   MIDDLEWARE & AUTH            │
    │  - JWT Verification            │
    │  - Role-Based Access Control   │
    │  - Request Validation          │
    │  - Error Handling              │
    └───────┬─────────────┬──────────┘
            │             │
    ┌───────▼─────────────▼──────────┐
    │   DATABASE LAYER               │
    │   (MongoDB with Mongoose ODM)  │
    ├────────────────────────────────┤
    │  Collections:                  │
    │  - Users                       │
    │  - Equipment                   │
    │  - Requests                    │
    │  - Notifications               │
    └────────────────────────────────┘
\`\`\`

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui with Radix UI
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Notifications**: Sonner Toast Library

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js 14 API Routes
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **ORM**: Mongoose

### Database
- **Primary DB**: MongoDB Atlas
- **Query Builder**: Mongoose ODM
- **Indexing**: MongoDB indexes for performance

### DevTools & Build
- **Package Manager**: bun, npm, yarn, or pnpm
- **Bundler**: Turbopack (Next.js 14 default)
- **Language**: TypeScript
- **Linting**: ESLint

## Folder Structure

\`\`\`
school-equipment-lending-portal/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes group
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── register/
│   │   │   └── page.tsx          # Registration page
│   │   └── layout.tsx            # Auth layout (unstyled)
│   │
│   ├── (dashboard)/              # Protected routes group
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard
│   │   ├── equipment/
│   │   │   └── page.tsx          # Equipment management
│   │   ├── requests/
│   │   │   └── page.tsx          # My requests
│   │   ├── all-requests/
│   │   │   └── page.tsx          # Admin: all requests
│   │   ├── request/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Request detail
│   │   ├── returns/
│   │   │   └── page.tsx          # Return tracking
│   │   └── layout.tsx            # Dashboard layout with header
│   │
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts      # User registration
│   │   │   ├── login/
│   │   │   │   └── route.ts      # User authentication
│   │   │   └── profile/
│   │   │       └── route.ts      # Get user profile
│   │   │
│   │   ├── equipment/
│   │   │   ├── route.ts          # GET all, POST new
│   │   │   └── [id]/
│   │   │       └── route.ts      # PUT, DELETE equipment
│   │   │
│   │   ├── requests/
│   │   │   ├── route.ts          # GET all, POST new
│   │   │   └── [id]/
│   │   │       └── route.ts      # PUT update status
│   │   │
│   │   ├── notifications/
│   │   │   ├── route.ts          # GET notifications
│   │   │   └── check-overdue/
│   │   │       └── route.ts      # Check overdue items
│   │   │
│   │   └── users/ (Admin only)
│   │       ├── route.ts          # GET all users
│   │       └── [id]/
│   │           └── route.ts      # PUT, DELETE user
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   └── ... (other UI components)
│   │
│   ├── app-header.tsx            # Main header with nav
│   └── notification-panel.tsx    # Notification dropdown
│
├── contexts/
│   └── auth-context.tsx          # Auth state management
│
├── lib/
│   ├── mongodb.ts                # DB connection
│   ├── auth.ts                   # JWT utilities
│   └── utils.ts                  # Helper functions
│
├── middleware/
│   └── auth.ts                   # Auth middleware
│
├── models/
│   ├── User.ts                   # User schema
│   ├── Equipment.ts              # Equipment schema
│   ├── Request.ts                # Request schema
│   └── Notification.ts           # Notification schema
│
├── public/                       # Static assets
│   ├── icon.svg
│   └── placeholder.svg
│
└── config files
    ├── next.config.mjs
    ├── tsconfig.json
    ├── postcss.config.mjs
    └── package.json
\`\`\`

## Data Flow

### User Registration & Authentication

\`\`\`
1. User enters credentials on /register page
2. Frontend validates input
3. POST /api/auth/register with data
4. Backend validates and hashes password
5. User document created in MongoDB
6. JWT token generated and returned
7. Token stored in localStorage (via auth context)
8. User redirected to dashboard based on role
\`\`\`

### Equipment Borrowing Request

\`\`\`
1. Student browses equipment on /dashboard
2. Clicks "Request" button
3. Form opens with dueDate picker
4. Frontend validates:
   - Quantity ≤ available
   - DueDate is in future
   - No overlapping requests
5. POST /api/requests with data
6. Backend verifies:
   - User authenticated
   - Equipment exists
   - Sufficient availability
   - No overlaps
7. Request created with "pending" status
8. Notification created for admins
9. Toast shows confirmation
10. Request appears in My Requests
\`\`\`

### Request Approval Workflow

\`\`\`
1. Admin views /all-requests
2. Sees pending requests
3. Clicks "Approve" or "Reject"
4. Dialog confirms action
5. PUT /api/requests/:id with new status
6. Backend:
   - Updates request status
   - If approved:
     * Decrements equipment.availableQuantity
     * Sets approvedBy user
   - If rejected:
     * Keeps availability unchanged
     * Records rejection reason
7. Notification sent to requester
8. Equipment list updates in real-time
9. Toast confirms action
\`\`\`

### Overdue Detection & Notifications

\`\`\`
1. Admin manually triggers or scheduled job runs
2. POST /api/notifications/check-overdue
3. Backend:
   - Queries all approved requests with dueDate < now
   - Creates "overdue-alert" notifications
   - Calculates daysOverdue
   - Sets up email queue (optional)
4. Notifications appear in user dashboard
5. Bell icon updates with unread count
6. 30-second polling refreshes notifications
\`\`\`

### Return Workflow

\`\`\`
1. Student navigates to /returns
2. Views active borrowed items
3. Clicks "Mark Returned"
4. Confirmation dialog
5. PUT /api/requests/:id with status: "returned"
6. Backend:
   - Updates returnDate to now
   - Changes status to "returned"
   - Increments equipment.availableQuantity
7. Notification sent to approver
8. Equipment becomes available again
9. Item moves from "Active" to "Returned" section
\`\`\`

## Security Architecture

### Authentication
- **JWT Tokens**: Stateless authentication using JWT
- **Token Storage**: localStorage with secure flag
- **Token Refresh**: Not implemented (consider for production)
- **Password Hashing**: bcryptjs with 10 salt rounds

### Authorization
- **Role-Based Access Control (RBAC)**:
  - Student: View equipment, make requests, track own items
  - Staff: Approve/reject requests, view all requests
  - Admin: Full access, user management, equipment management
- **Route Protection**: Middleware validates role on each request
- **API Protection**: Each endpoint checks authorization

### Data Protection
- **HTTPS**: Enforced in production (Vercel deployment)
- **CORS**: Not explicitly set (same-origin by default)
- **Input Validation**: Server-side validation on all endpoints
- **SQL Injection Prevention**: Using Mongoose prevents injection
- **XSS Prevention**: React auto-escapes, sanitize user input

### Sensitive Data
- Passwords never logged or exposed
- JWT tokens contain only user ID, email, role
- Sensitive fields excluded from API responses
- Error messages don't expose system details

## Error Handling

### Frontend Error Handling
\`\`\`
Try-Catch in components
↓
Catch block displays toast notification
↓
User sees friendly error message
↓
Console logs technical details for debugging
\`\`\`

### Backend Error Handling
\`\`\`
Route handler receives request
↓
Try-Catch wraps all logic
↓
Validation errors → 400 Bad Request
Authentication errors → 401 Unauthorized
Authorization errors → 403 Forbidden
Not found → 404 Not Found
Server errors → 500 Internal Server Error
↓
Error response with message
↓
Frontend displays toast
\`\`\`

## Scalability Considerations

### Current Implementation
- Suitable for small to medium institutions (< 5,000 users)
- Single MongoDB instance sufficient

### Future Optimization
- **Caching**: Redis for frequently accessed data
- **Pagination**: Already implemented for large lists
- **Indexing**: MongoDB indexes optimized
- **Load Balancing**: Vercel handles automatically
- **Database Sharding**: MongoDB Atlas supports

### Potential Bottlenecks
- Overdue check job (optimize query with aggregation)
- Large equipment lists (implement better filtering)
- Concurrent requests (implement transaction support)

## Monitoring & Logging

### Current Logging
- Console.log in development
- Error tracking on backend
- Browser console for frontend issues

### Recommended Production Logging
- Implement Winston or Pino for structured logging
- Use Sentry for error tracking
- Monitor API performance with middleware
- Track database query performance

## Deployment Architecture

### Vercel Deployment
\`\`\`
GitHub Repository
↓
Vercel detects push
↓
Build process (Next.js build)
↓
Environment variables loaded
↓
Static + dynamic routes deployed
↓
Edge Functions (Middleware)
↓
Production URL active
\`\`\`

### Environment Separation
- **Development**: localhost:3000, local MongoDB
- **Staging**: Vercel preview deployment
- **Production**: Vercel production deployment

## API Rate Limiting

Not currently implemented. For production:
- Implement with Upstash Redis
- 100 requests/minute per user
- 1000 requests/minute per IP

## Backup & Recovery

### MongoDB Atlas
- Daily snapshots enabled
- 30-day retention
- Point-in-time recovery available

### Code Backup
- Git repository on GitHub
- Vercel preserves deployment history

## Performance Optimization

### Frontend
- Image optimization with Next.js Image
- Component code splitting
- CSS optimization with Tailwind
- React context memoization

### Backend
- Database indexing optimized
- Query optimization in Mongoose
- Pagination for large results
- Caching common queries

## Future Enhancements

1. **Real-time Notifications**: WebSocket support
2. **Email Notifications**: SendGrid integration
3. **Analytics Dashboard**: Usage statistics
4. **Damage Logs**: Equipment maintenance tracking
5. **Mobile App**: React Native version
6. **Advanced Reporting**: Export to PDF/Excel
7. **Integration**: Calendar sync, calendar invites
