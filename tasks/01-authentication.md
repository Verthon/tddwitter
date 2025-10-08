# Authentication & User Management Tasks

## Overview
Implement registration, login, and user state management matching Bluesky's authentication flow. All API integrations should be mocked using MSW handlers.

## Technical Requirements
- React components with TypeScript
- MSW for API mocking
- React Query for state management
- Form validation
- JWT token handling (mocked)

## Task Breakdown

### 1. Create Login Component
**File:** `src/core/auth/components/LoginForm.tsx`

#### Steps:
1. Create form component with email/password fields
2. Add form validation (email format, min password length)
3. Create MSW handler for login endpoint
4. Integrate with React Query mutation
5. Store auth token in localStorage (mocked)
6. Update auth context with user state
7. Handle error states (invalid credentials, network errors)
8. Add loading state during authentication

#### MSW Handler:
```typescript
// src/core/auth/mocks/authHandlers.ts
http.post(`${baseUrl}/auth/login`, async ({ request }) => {
  const body = await request.json();
  // Validate credentials
  if (body.email === 'test@example.com' && body.password === 'password123') {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: { id: '1', email: body.email, username: 'testuser' }
    });
  }
  return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
})
```

### 2. Create Registration Component
**File:** `src/core/auth/components/RegisterForm.tsx`

#### Steps:
1. Create multi-step registration form
2. Step 1: Email and password
3. Step 2: Username and profile info
4. Step 3: Avatar upload (optional)
5. Add password strength indicator
6. Check username availability (MSW endpoint)
7. Create MSW handler for registration
8. Auto-login after successful registration
9. Add terms acceptance checkbox

#### MSW Handler:
```typescript
// src/core/auth/mocks/authHandlers.ts
http.post(`${baseUrl}/auth/register`, async ({ request }) => {
  const body = await request.json();
  // Simulate registration
  return HttpResponse.json({
    token: 'mock-jwt-token',
    user: {
      id: 'new-user-id',
      email: body.email,
      username: body.username,
      profileDescription: body.profileDescription || ''
    }
  });
})
```

### 3. Create Auth Guard Component
**File:** `src/core/auth/components/AuthGuard.tsx`

#### Steps:
1. Create HOC for protected routes
2. Check authentication status
3. Redirect to login if not authenticated
4. Show loading state during auth check
5. Pass user context to children
6. Handle token expiration

### 4. Update User Hook Enhancement
**File:** `src/core/auth/hooks/useAuth.ts`

#### Steps:
1. Add login mutation
2. Add logout mutation
3. Add registration mutation
4. Add password reset functionality
5. Add token refresh logic (mocked)
6. Store/retrieve token from localStorage
7. Add remember me functionality

### 5. Create Public/Private Layout Components
**Files:** 
- `src/core/layouts/PublicLayout.tsx`
- `src/core/layouts/PrivateLayout.tsx`

#### Steps:
1. Create layout for non-authenticated users
2. Show login/register buttons in header
3. Create layout for authenticated users
4. Show user avatar and dropdown menu
5. Add logout functionality
6. Display username in header

### 6. Create User Profile Dropdown
**File:** `src/core/auth/components/UserDropdown.tsx`

#### Steps:
1. Display user avatar
2. Show username on hover
3. Create dropdown menu with:
   - Profile link
   - Settings link
   - Logout button
4. Add keyboard navigation
5. Close on outside click

### 7. Session Management
**File:** `src/core/auth/services/sessionService.ts`

#### Steps:
1. Create token storage service
2. Add token validation (check expiry)
3. Create refresh token mechanism (mocked)
4. Handle multiple tabs synchronization
5. Clear session on logout
6. Add session timeout warning

### 8. Password Reset Flow
**Files:**
- `src/core/auth/components/ForgotPassword.tsx`
- `src/core/auth/components/ResetPassword.tsx`

#### Steps:
1. Create forgot password form
2. Send reset email (mocked)
3. Create reset token validation
4. Create new password form
5. Add password confirmation
6. Show success message
7. Auto-redirect to login

## Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Registration with new account
- [ ] Registration with existing email
- [ ] Logout functionality
- [ ] Protected route access
- [ ] Token persistence on refresh
- [ ] Session timeout handling
- [ ] Password reset flow
- [ ] Form validation errors

## Dependencies
```json
{
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "@hookform/resolvers": "^3.x"
}
```

## Notes for AI Implementation
- Focus on clean, reusable components
- Use TypeScript interfaces for all data types
- Implement proper error boundaries
- Add accessibility attributes (aria-labels, roles)
- Use semantic HTML elements
- Keep MSW handlers simple and predictable
- Add proper loading states for all async operations