# Admin Authentication - Vercel Deployment Guide

## Overview
The admin authentication system now uses **JWT (JSON Web Tokens)** for stateless authentication, which is compatible with serverless platforms like Vercel.

## Why JWT?
Previously, the system used SQLite database sessions, which failed in Vercel production with the error:
```
SqliteError: attempt to write a readonly database
```

Vercel's serverless environment has a **read-only filesystem**, so we cannot write to SQLite databases. JWT tokens solve this by being:
- **Stateless**: No database writes required
- **Secure**: Cryptographically signed
- **Serverless-friendly**: Works in any environment

## Required Environment Variable

### For Vercel Production

You **MUST** set the `JWT_SECRET` environment variable in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `JWT_SECRET`
   - **Value**: A secure random string (see below for generation)
   - **Environment**: Production (and optionally Preview/Development)

### Generating a Secure JWT Secret

Use one of these methods to generate a secure random string:

**Option 1: OpenSSL (recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
- Use a trusted password generator to create a 44+ character random string

### Example
```
JWT_SECRET=xK7p9mQw2vB8nR3tY6hJ4gF1sD5aL0zC9qE8wX2vN7mK4pR6tY3hJ
```

## Local Development

For local development, you can either:

1. **Create a `.env.local` file** (recommended):
```bash
JWT_SECRET=your-local-development-secret
```

2. **Use the default fallback**: The system will use a default secret if none is provided (NOT recommended for production)

## Testing the Deployment

After deploying to Vercel with the `JWT_SECRET` environment variable set:

1. Navigate to `https://your-domain.vercel.app/admin/login`
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`
3. You should be redirected to the admin dashboard

## Security Notes

- ✅ **Never commit** `.env.local` to version control
- ✅ **Use different secrets** for development and production
- ✅ **Rotate the secret** periodically for enhanced security
- ✅ Token expiration is set to **7 days** by default
- ✅ Cookies are **httpOnly** and **secure** in production

## Troubleshooting

### Still getting SQLITE_READONLY error
- Make sure you've redeployed after adding the JWT_SECRET
- Clear your Vercel build cache and redeploy

### Login not working
- Verify JWT_SECRET is set in Vercel
- Check browser console for errors
- Ensure cookies are enabled in your browser

### Sessions not persisting
- JWT tokens are stored in cookies with 7-day expiration
- Check that your browser accepts cookies
- Verify the cookie path and domain settings

## Admin User Setup

The default admin user is created automatically when the database initializes:
- Username: `admin`
- Password: `admin123`

**IMPORTANT**: Change the default password after first login in production!
