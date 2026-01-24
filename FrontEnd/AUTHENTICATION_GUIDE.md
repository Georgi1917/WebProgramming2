# Authentication Implementation Guide

## Overview
An authentication system has been integrated into your frontend that prompts unlogged users to log in before they can create, update, or delete items (artists, playlists, users).

## What Was Added

### 1. **AuthContext** (`src/context/AuthContext.js`)
- Central authentication state management using React Context
- Tracks user login status and authentication token
- Manages login/logout operations
- Handles login modal visibility
- Stores pending actions that require authentication

### 2. **LoginModal Component** (`src/components/Auth/LoginModal.js`)
- A modal popup that appears when unlogged users try to perform protected actions
- Collects username and password
- Sends credentials to your backend `/auth` endpoint
- Displays error messages for invalid credentials
- Automatically executes the pending action after successful login

### 3. **Updated API Service** (`src/services/api.js`)
- Automatically adds JWT token to all API requests
- Reads token from localStorage and includes it in the Authorization header

### 4. **AuthService** (`src/services/authService.js`)
- Helper functions for authentication operations
- Login, logout, token retrieval, and status checking

### 5. **Updated Pages**
All three main pages (Artists, Playlists, Users) now include authentication checks:
- **ArtistsPage.js**
- **PlaylistsPage.js**
- **UsersPage.js**

Each page's create, update, and delete handlers now call `requireLogin()` before executing the action.

### 6. **Enhanced Navbar** (`src/components/Layout/Navbar.js`)
- Shows current logged-in username
- Displays "Not logged in" when user is not authenticated
- Includes a logout button for authenticated users
- Updated styling in `Navbar.css`

## How It Works

### User Flow for Protected Actions

1. **Unauthenticated User Action**
   - User clicks "Add Artist", "Edit", or "Delete" button while not logged in
   
2. **Login Check**
   - `requireLogin()` is called
   - If user is not authenticated, the login modal appears
   
3. **Login Attempt**
   - User enters username and password
   - System sends credentials to `/api/auth` endpoint
   
4. **Authentication**
   - Backend validates credentials against JWT configuration
   - Returns JWT token on success
   
5. **Token Storage**
   - Token is saved to localStorage
   - Token is automatically added to all subsequent API requests
   
6. **Action Execution**
   - Pending action (create/update/delete) is automatically executed
   - Modal closes
   - User sees the result

7. **Logout**
   - Click the "Logout" button in the navbar
   - Token is removed from localStorage
   - Next protected action will trigger login again

## Code Example

Here's how authentication is integrated in your pages:

```javascript
const { requireLogin } = useAuth();

const handleAdd = () => {
  // Check if user is authenticated, show login if not
  if (!requireLogin(() => handleAdd())) return;
  
  // If we reach here, user is authenticated
  setEditingId(null);
  setFormData({ name: '', country: '' });
  setShowForm(true);
};
```

## Backend Requirements

Your AuthController is already properly configured. It:
- Accepts POST requests at `/api/auth`
- Expects `{ username: string, password: string }`
- Returns `{ token: string }` on success
- Returns 401 Unauthorized on failure

## Token Management

- JWT tokens are automatically included in all API requests via axios interceptor
- Tokens are stored in `localStorage` under the key `authToken`
- User information is stored under the key `user`
- Tokens are cleared on logout

## Styling

All authentication UI components include:
- Modal overlay with backdrop
- Smooth animations (slide-up effect)
- Professional styling matching your existing theme
- Error messages with clear visual feedback
- Responsive design

## Security Notes

1. Tokens are stored in localStorage (as per your current setup)
2. Make sure your backend validates tokens properly
3. Consider adding token expiration handling in the LoginModal if needed
4. JWT tokens from your backend are automatically validated

## Files Modified/Created

### Created:
- `src/context/AuthContext.js`
- `src/components/Auth/LoginModal.js`
- `src/components/Auth/LoginModal.css`
- `src/services/authService.js`

### Modified:
- `src/App.js` - Added AuthProvider and LoginModal
- `src/services/api.js` - Added token interceptor
- `src/pages/ArtistsPage.js` - Added authentication checks
- `src/pages/PlaylistsPage.js` - Added authentication checks
- `src/pages/UsersPage.js` - Added authentication checks
- `src/components/Layout/Navbar.js` - Added user info and logout
- `src/components/Layout/Navbar.css` - Updated styling

## Testing

1. **Test Unauthenticated Access**
   - Try to create/edit/delete an item without logging in
   - Login modal should appear
   
2. **Test Login**
   - Enter valid credentials
   - Action should execute automatically
   
3. **Test Logout**
   - Click logout button in navbar
   - Try to create/edit/delete again
   - Login modal should appear again

4. **Test Invalid Credentials**
   - Try logging in with wrong password
   - Error message should appear
