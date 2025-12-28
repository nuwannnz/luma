# Luma Authentication Implementation

This document describes the authentication system implementation using AWS Cognito.

## Overview

The Luma app now has a complete authentication system with:
- AWS Cognito User Pool for user management
- Custom login page at `/auth`
- Protected dashboard at `/me`
- Token-based authentication with JWT
- Automatic token refresh

## Architecture

### Infrastructure (AWS CDK)

The authentication infrastructure is defined in `infra/cdk/stacks/luma_auth_stack.go`:

- **Cognito User Pool**: Manages user accounts
  - Email-based sign-in
  - Standard password policy (min 8 chars, uppercase, lowercase, digits)
  - Email verification
  - Password recovery via email

- **User Pool Client**: Web app client configuration
  - User password and SRP authentication flows
  - 60-minute access and ID token validity
  - 30-day refresh token validity
  - Token revocation enabled

- **Identity Pool**: Federated identity support

- **API Gateway Authorizer**: JWT validation for backend API

### Frontend (SvelteKit)

#### Routes
- `/` - Root page (redirects to `/auth`)
- `/auth` - Login page
- `/me` - Protected dashboard (requires authentication)

#### Auth Service (`lib/auth/authService.ts`)
Singleton service that handles:
- User sign-in with email/password
- Session management
- Token storage in localStorage
- Token refresh
- Sign-out

## Deployment

### 1. Deploy CDK Infrastructure

```bash
cd infra/cdk
# Set environment variables
export AWS_ACCOUNT_ID=your-account-id
export AWS_REGION=us-east-1

# Deploy the auth stack
cdk deploy LumaAuthStack
```

After deployment, note the outputs:
- `UserPoolId`
- `UserPoolClientId`
- `IdentityPoolId`

### 2. Configure Frontend

Create `apps/luma-web/.env`:

```env
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_AWS_REGION=us-east-1
```

### 3. Create Test User

Using AWS CLI:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username test@example.com \
  --user-attributes Name=email,Value=test@example.com Name=email_verified,Value=true \
  --temporary-password TempPassword123! \
  --message-action SUPPRESS

# Set permanent password
aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username test@example.com \
  --password YourPassword123! \
  --permanent
```

### 4. Run the App

```bash
cd apps/luma-web
npm install
npm run dev
```

Visit http://localhost:5173 and log in with your test credentials.

## Security Considerations

### Token Storage
- Tokens are stored in localStorage (not recommended for production)
- **Production recommendation**: Use httpOnly cookies with backend token management

### Password Policy
- Minimum 8 characters
- Requires uppercase, lowercase, and digits
- No special characters required (as per requirements)
- Consider enabling MFA for production

### CORS
- API Gateway configured with CORS for all origins
- **Production recommendation**: Restrict to specific domains

### Token Expiry
- Access tokens: 60 minutes
- ID tokens: 60 minutes
- Refresh tokens: 30 days
- Automatic token refresh handled by Cognito SDK

## API Integration

Backend APIs can validate JWT tokens using the Cognito authorizer:

```typescript
// Example: Include token in API requests
const accessToken = authService.getAccessToken();

fetch('/api/v1/endpoint', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

The API Gateway will automatically validate the JWT before forwarding to Lambda.

## Troubleshooting

### "Both UserPoolId and ClientId are required"
- Ensure `.env` file exists with correct values
- Restart dev server after creating `.env`

### Redirect loop between `/` and `/auth`
- Clear localStorage
- Check authentication state in browser dev tools

### Token expired errors
- The SDK automatically refreshes tokens
- If issues persist, sign out and sign in again

## Future Enhancements

1. **Sign-up flow**: Allow users to self-register
2. **Password reset**: Add forgot password functionality
3. **MFA**: Enable multi-factor authentication
4. **Social login**: Add Google/Facebook OAuth
5. **Session management**: Add "remember me" functionality
6. **Secure storage**: Move to httpOnly cookies
