# School Equipment Lending Portal

A full-stack web application for managing school equipment borrowing, built with Next.js 14, MongoDB, and React.

## Overview

The School Equipment Lending Portal is a comprehensive solution for educational institutions to manage equipment inventory, borrowing requests, and return tracking. It supports role-based access control (Students, Staff, and Admins) with features including equipment management, borrowing workflows, due-date tracking, and overdue notifications.

## Features

### User Management
- Role-based access control (Student, Staff, Admin)
- Secure authentication with JWT tokens
- User profile management
- Admin user management capabilities

### Equipment Management
- Complete inventory tracking with condition monitoring
- Category-based organization (sports, lab, classroom, multimedia, library, other)
- Real-time availability tracking
- Search and filter capabilities
- Admin-only add/edit/delete operations

### Borrowing Workflow
- Students/Staff can request equipment with due dates
- Admin/Staff approval/rejection workflow
- Automatic availability quantity updates
- Return tracking with timestamps
- Overlapping request prevention

### Due-Date Tracking & Notifications
- Real-time overdue alerts
- Dashboard notification panel
- Notification history
- Email notification support (ready for implementation)

### Advanced Features
- Pagination and sorting
- Comprehensive error handling
- Toast notifications for user feedback
- Responsive design across all devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT-based with bcryptjs password hashing
- **UI Components**: shadcn/ui with Radix UI primitives

## Prerequisites

- Node.js 18+ or Bun
- MongoDB Atlas account
- npm, yarn, bun, or pnpm package manager

## Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/school-equipment-lending-portal.git
cd school-equipment-lending-portal
\`\`\`

### 2. Install Dependencies
\`\`\`bash
bun install
# or
npm install
\`\`\`

### 3. Set Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_min_32_chars
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

**Environment Variables:**
- `MONGODB_URI`: MongoDB connection string from MongoDB Atlas
- `JWT_SECRET`: Secret key for JWT token signing (minimum 32 characters recommended)
- `NEXT_PUBLIC_API_URL`: Frontend API base URL

### 4. Run Development Server
\`\`\`bash
bun run dev
# or
npm run dev
\`\`\`

Visit `http://localhost:3000` in your browser.

## Project Structure

\`\`\`
school-equipment-lending-portal/
├── app/
│   ├── (auth)/                 # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── equipment/
│   │   ├── requests/
│   │   ├── returns/
│   │   └── all-requests/
│   ├── api/                    # API routes
│   │   ├── auth/
│   │   ├── equipment/
│   │   ├── requests/
│   │   └── notifications/
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── app-header.tsx
│   └── notification-panel.tsx
├── contexts/                   # React contexts
│   └── auth-context.tsx
├── lib/
│   ├── mongodb.ts             # MongoDB connection
│   ├── auth.ts                # JWT utilities
│   └── utils.ts               # Helper functions
├── models/                     # Mongoose schemas
│   ├── User.ts
│   ├── Equipment.ts
│   ├── Request.ts
│   └── Notification.ts
├── middleware/
│   └── auth.ts
└── scripts/                    # Utility scripts
\`\`\`

## Usage Guide

### For Students/Staff

1. **Register**: Create an account with email and password
2. **Login**: Sign in with credentials
3. **Browse Equipment**: View all available equipment on the dashboard
4. **Request Equipment**: Click on equipment to request borrowing
5. **Track Requests**: View request status in "My Requests"
6. **Return Items**: Mark equipment as returned in "Returns" section

### For Admins

1. **Login**: Sign in with admin credentials
2. **Manage Equipment**: 
   - Add new equipment items
   - Edit equipment details
   - Delete equipment
   - View inventory status
3. **Manage Requests**:
   - View all requests in "All Requests"
   - Approve or reject requests
   - Track return status
4. **View Dashboard**: Monitor overdue items and notifications

## API Documentation

See `API_DOC.md` for complete API endpoint documentation.

## Database Schema

See `DB_SCHEMA.md` for detailed database model documentation.

## Architecture

See `ARCHITECTURE.md` for system architecture and data flow diagrams.

## Testing

Use the provided Postman collection (`postman_collection.json`) to test all API endpoints.

### Manual Testing Flow

1. Register as student, staff, and admin
2. Create equipment items as admin
3. Request items as student
4. Approve requests as admin
5. Mark returns as student
6. Verify notifications appear

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect GitHub repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

\`\`\`bash
vercel deploy
\`\`\`

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access settings
- Ensure IP address is whitelisted

### Authentication Issues
- Verify JWT_SECRET is set correctly
- Check browser console for token errors
- Clear cookies and try logging in again

### API Errors
- Check network tab in browser DevTools
- Verify user role has required permissions
- Check error messages in toast notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

## AI-Assisted Development

This project incorporates AI-assisted code generation using tools like Claude, GitHub Copilot, and v0. See `AI_USAGE_LOG.md` for detailed documentation of AI usage and contributions.
