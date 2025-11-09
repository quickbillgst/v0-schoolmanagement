# School Equipment Lending Portal - Testing Guide

## Overview
This guide provides comprehensive testing workflows for all user roles and API endpoints.

## Base URL
- Local: `http://localhost:3000`
- Production: `https://your-deployment-url.vercel.app`

## Test Users

Create these test accounts for comprehensive testing:

### 1. Student Account
- Email: `student@test.com`
- Password: `TestPass123!`
- Role: Student

### 2. Staff Account
- Email: `staff@test.com`
- Password: `TestPass123!`
- Role: Staff

### 3. Admin Account
- Email: `admin@test.com`
- Password: `TestPass123!`
- Role: Admin

## Testing Workflows

### 1. User Management Testing

#### Register New User
1. Go to http://localhost:3000/register
2. Fill in: Name, Email, Password, Role
3. Click Sign Up
4. Verify redirect to dashboard
5. Check user is logged in (header shows name and role)

**Expected Results:**
- Success toast notification
- User data stored in localStorage
- Redirect to /dashboard
- User info visible in header

#### Login
1. Go to http://localhost:3000/login
2. Enter registered email and password
3. Click Sign In
4. Verify redirect to dashboard

**Expected Results:**
- Success toast on login
- Auth token stored
- User context updated
- Dashboard displays equipment

#### Logout
1. Click Logout in header
2. Verify redirect to home page
3. Check localStorage is cleared

**Expected Results:**
- Logout toast shown
- Session cleared
- Cannot access protected routes

### 2. Equipment Management Testing (Admin Only)

#### Add Equipment
1. Login as admin
2. Go to Equipment Management (sidebar)
3. Click "Add Equipment"
4. Fill in form:
   - Name: "Projector A"
   - Category: "Projector"
   - Quantity: 5
   - Condition: "Excellent"
   - Description: "Conference room projector"
5. Click "Add Equipment"

**Expected Results:**
- Success toast
- Equipment appears in list
- Available quantity equals total quantity
- Can immediately add another item

#### Edit Equipment (Future Feature)
- Note: Edit functionality can be added in Phase 2

#### Delete Equipment
1. In Equipment Management
2. Find equipment to delete
3. Click "Delete"
4. Confirm deletion dialog
5. Click confirm

**Expected Results:**
- Equipment removed from list
- Success toast shown
- If equipment has active requests, show warning

#### View Equipment List
1. Login as any role
2. Go to Dashboard
3. Verify all equipment displays with:
   - Name, Category, Description
   - Available quantity / Total quantity
   - Condition status

**Expected Results:**
- All equipment visible
- Quantities accurate
- Can filter by category
- Can search by name/description

### 3. Borrowing Request Workflow Testing

#### Student/Staff Creates Request

**Scenario 1: Available Equipment**
1. Login as student
2. Go to Dashboard
3. Find "Projector A" (5 available)
4. Click "Request"
5. Enter:
   - Quantity: 2
   - Due Date: 7 days from today
6. Click "Submit Request"

**Expected Results:**
- Success toast: "Equipment request created successfully"
- Redirect to /requests page
- Request shows "pending" status
- Available quantity in dashboard decreases

**Scenario 2: Insufficient Quantity**
1. Request more items than available
2. Submit form

**Expected Results:**
- Error toast: "Only X items available"
- Form not submitted
- Request quantity field resets

**Scenario 3: Past Due Date**
1. Try to select yesterday as due date
2. Browser prevents submission (date input validation)

#### View My Requests
1. Login as student
2. Go to "My Requests" (sidebar)
3. Verify all personal requests display with:
   - Equipment name and category
   - Request status badge
   - Request date, due date, return date
   - Quantity requested

**Expected Results:**
- Only personal requests visible
- Status colors match: pending (yellow), approved (green), rejected (red), returned (blue)
- Dates formatted correctly

### 4. Request Approval Workflow (Admin/Staff)

#### View All Requests
1. Login as admin/staff
2. Go to "All Requests" (sidebar)
3. Verify all requests visible (not just own)
4. Filter by status works

#### Approve Request
1. Find pending request
2. Click "Approve"
3. Verify status changes to "approved"

**Expected Results:**
- Request status updates to "approved"
- Success toast shown
- Equipment available quantity decreases
- Only pending requests show approve/reject buttons

#### Reject Request
1. Find pending request
2. Click "Reject"
3. Verify status changes to "rejected"

**Expected Results:**
- Request status updates to "rejected"
- Success toast shown
- Equipment available quantity unchanged
- Requester sees rejected status in My Requests

#### View Request Details
1. In All Requests view
2. Each request card shows:
   - Equipment name
   - Requester name
   - Requester email
   - Request/due dates
   - Current status
   - Quantity requested

### 5. Return Tracking Workflow

#### Mark Equipment as Returned
1. Login as admin/staff
2. Go to "All Requests"
3. Find approved request
4. Click "Mark as Returned"

**Expected Results:**
- Request status changes to "returned"
- Return date set to current date
- Equipment available quantity increases
- Button disappears (only shows for approved requests)

#### Student Marks Own Item as Returned
1. Login as student
2. Go to "My Requests"
3. Find approved request
4. (In Phase 2) Add return button for students to mark own items as returned

### 6. Role-Based Access Control Testing

#### Student Access
- Can: View dashboard, search equipment, create requests, view own requests
- Cannot: Add/edit/delete equipment, approve/reject requests, view all requests

**Test:**
1. Login as student
2. Try to access `/equipment` - should redirect to dashboard
3. Try to access `/all-requests` - should redirect or not show link

#### Staff Access
- Can: View all the above PLUS approve/reject requests, mark as returned
- Cannot: Add/edit/delete equipment

**Test:**
1. Login as staff
2. Access `/all-requests` - should work
3. Cannot access `/equipment` - should not show

#### Admin Access
- Can: Everything - manage equipment, approve requests, mark returned

**Test:**
1. Login as admin
2. Can access `/equipment`, `/all-requests`, create requests
3. All administrative buttons available

### 7. Data Validation Testing

#### Quantity Validation
- Test requesting 0 items: Error shown
- Test requesting -1 items: Error shown
- Test requesting more than available: Error shown
- Test requesting valid quantity: Success

#### Date Validation
- Test due date in the past: Browser prevents (HTML5 validation)
- Test due date today: Should work
- Test due date in future: Should work

#### Field Validation
- Try submitting forms with empty required fields: Error shown
- Verify email format validation on registration
- Verify password requirements on registration

### 8. Error Handling Testing

#### Network Errors
1. With dev tools open, throttle network to "Offline"
2. Try to create equipment request
3. Should show error toast

**Expected: Toast shows "Failed to..." message**

#### Invalid Token
1. Login and copy token from localStorage
2. Modify token in localStorage
3. Refresh page
4. Try API call
5. Should redirect to login or show error

#### API Response Errors
- Test with intentional database disconnect
- Verify error messages are user-friendly
- Check console for detailed error logs

### 9. Full End-to-End Workflow

**Complete Borrow and Return Cycle:**

1. **Admin Setup**
   - Login as admin
   - Add equipment: "Microscope" (quantity: 3)

2. **Student Request**
   - Login as student
   - Find "Microscope" on dashboard (available: 3)
   - Request 2 units, due date: 1 week from today
   - Verify success toast
   - Go to "My Requests"
   - Verify request shows "pending"
   - Dashboard now shows Microscope: 1 available

3. **Admin Approval**
   - Login as admin
   - Go to "All Requests"
   - Find student's microscope request
   - Approve request
   - Verify status changes to "approved"

4. **Return Equipment**
   - Login as admin
   - Go to "All Requests"
   - Find approved request
   - Click "Mark as Returned"
   - Verify status changes to "returned"
   - Verify available quantity back to 3

5. **Student Verification**
   - Login as student
   - Go to "My Requests"
   - Verify request shows "returned"
   - Verify return date is set

## API Testing (Postman Collection)

All API endpoints are documented in the `postman_collection.json` file included in the project.

### Import Collection:
1. Open Postman
2. Click "Import"
3. Upload `postman_collection.json`
4. Collection ready to test

### Environment Variables in Postman:
- `base_url`: http://localhost:3000 or production URL
- `admin_token`: Token from admin login
- `student_token`: Token from student login
- `staff_token`: Token from staff login
- `equipment_id`: ID of created equipment
- `request_id`: ID of created request

## Performance Testing

### Load Times
- Dashboard load: < 2 seconds
- Equipment list render: < 1 second
- Request approval: < 500ms

### Database
- Verify indexes on frequently queried fields
- Monitor query times in logs
- Check for N+1 queries

## Security Testing

- Verify JWT tokens expire properly
- Test CORS headers
- Verify password hashing (bcrypt)
- Check for XSS vulnerabilities
- Verify SQL injection prevention (using Mongoose)
- Test rate limiting (optional enhancement)

## Known Limitations & Future Enhancements

1. **Phase 2 Enhancements:**
   - Edit equipment functionality
   - Student ability to cancel pending requests
   - Email notifications on request status changes
   - Request renewal/extension
   - Equipment condition reports
   - User profile management
   - Equipment photos/images
   - Request history archives
   - Reports and analytics dashboard

2. **Current Constraints:**
   - Single device per request quantity tracking needed
   - No automated reminder emails
   - No request queue management
   - Manual return verification only

## Troubleshooting

### Issue: "No token provided" error
**Solution:** Ensure you're logged in and token is stored in localStorage

### Issue: "Equipment not found" error
**Solution:** Verify equipment was created successfully as admin

### Issue: Requests not showing
**Solution:** For students, only personal requests shown. Use admin account to view all.

### Issue: Token expired
**Solution:** Log out and log back in to refresh token

## Success Criteria

Full integration is successful when:
- ✓ All user roles can register and login
- ✓ Equipment CRUD operations work smoothly
- ✓ Request creation with quantity validation works
- ✓ Request approval/rejection updates availability
- ✓ Return marking updates quantities correctly
- ✓ All role-based access control enforced
- ✓ Toast notifications appear for all actions
- ✓ Error messages are clear and helpful
- ✓ No console errors on happy path workflows
- ✓ Full borrowing cycle completes successfully
