# Stripe Payment Integration - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Current Configuration](#current-configuration)
3. [File Structure](#file-structure)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Payment Flow](#payment-flow)
6. [API Endpoints](#api-endpoints)
7. [Pages & Components](#pages--components)
8. [Testing Guide](#testing-guide)
9. [Production Deployment](#production-deployment)
10. [Troubleshooting](#troubleshooting)
11. [Security Best Practices](#security-best-practices)

---

## Overview

This documentation covers the complete Stripe payment gateway integration for the CARD NGO website. The integration allows users to make donations through a secure Stripe Checkout flow.

### Features
- ✅ Secure payment processing via Stripe Checkout
- ✅ Donation amount selection (preset or custom)
- ✅ Payment confirmation pages (success/failure)
- ✅ Webhook handling for payment events
- ✅ Session verification
- ✅ Responsive UI matching site design

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Payment Gateway**: Stripe Checkout
- **Styling**: TailwindCSS

---

## Current Configuration

### Stripe Account
- **Mode**: Test/Sandbox
- **Publishable Key**: `pk_test_51SgpveAzdwtYGD7CTlRLN1tGKVbAOU4Avynf3dbsxK2MrO2ffp1DQwhbCLkRB9zjvTK7hOdsAqwMt8B4YQIhHcRi00K6SLJ30z`
- **Secret Key**: `sk_test_51SgpveAzdwtYGD7CqZlwb3Ic8iLAOVjojCxku6ysAriFvQOe1evYA9WeBp17AdWX7laZmHqK57evFVTDWLnGyXTq0080t4zdb1`

### Environment Variables
Located in `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_51SgpveAzdwtYGD7CqZlwb3Ic8iLAOVjojCxku6ysAriFvQOe1evYA9WeBp17AdWX7laZmHqK57evFVTDWLnGyXTq0080t4zdb1
STRIPE_WEBHOOK_SECRET=  # To be configured
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## File Structure

```
card-website/
├── .env.local                          # Environment variables (not in git)
├── src/
│   ├── app/
│   │   ├── donation/
│   │   │   ├── confirm/
│   │   │   │   └── page.tsx           # Donation confirmation page
│   │   │   ├── success/
│   │   │   │   └── page.tsx           # Payment success page
│   │   │   ├── failure/
│   │   │   │   └── page.tsx           # Payment failure page
│   │   │   └── page.tsx                # Main donation page
│   │   └── api/
│   │       └── donation/
│   │           ├── create-checkout/
│   │           │   └── route.ts       # Creates Stripe checkout session
│   │           ├── webhook/
│   │           │   └── route.ts       # Handles Stripe webhooks
│   │           └── verify-session/
│   │               └── route.ts       # Verifies payment session
│   └── layouts/
│       └── components/
│           └── DonationForm.tsx        # Donation form component
├── STRIPE_SETUP.md                     # Quick setup guide
└── STRIPE_INTEGRATION_DOCUMENTATION.md # This file
```

---

## Environment Variables Setup

### Required Variables

#### 1. STRIPE_SECRET_KEY
- **Description**: Your Stripe secret API key
- **Format**: `sk_test_...` (test) or `sk_live_...` (production)
- **Location**: Stripe Dashboard → Developers → API keys
- **Status**: ✅ Configured

#### 2. STRIPE_WEBHOOK_SECRET
- **Description**: Webhook signing secret for verifying webhook events
- **Format**: `whsec_...`
- **How to Get**:
  1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
  2. Click "Add endpoint"
  3. Enter webhook URL: `https://yourdomain.com/api/donation/webhook`
  4. Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
  5. Copy the "Signing secret"
- **Status**: ⚠️ Needs to be configured

#### 3. NEXT_PUBLIC_BASE_URL
- **Description**: Base URL for redirect URLs after payment
- **Local**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`
- **Status**: ✅ Configured (local)

### Setting Up Environment Variables

1. **Create `.env.local` file** in the project root (if not exists)
2. **Add the variables** as shown above
3. **Restart the Next.js server** after making changes

```bash
# Restart development server
npm run dev
```

---

## Payment Flow

### Complete User Journey

```
1. User clicks "Donate Now" button
   ↓
2. Redirects to /donation/confirm
   ↓
3. User selects/enters donation amount
   ↓
4. User clicks "Proceed to Payment"
   ↓
5. POST /api/donation/create-checkout
   - Creates Stripe Checkout Session
   - Returns checkout URL
   ↓
6. Redirect to Stripe Checkout page
   ↓
7. User enters payment details
   ↓
8. Payment Processing
   ↓
9a. SUCCESS → Redirect to /donation/success?session_id={ID}
    - Verifies payment via /api/donation/verify-session
    - Displays confirmation
    
9b. FAILURE → Redirect to /donation/failure
    - Displays error message
    - Option to retry
```

### Technical Flow Diagram

```
┌─────────────┐
│   Frontend   │
│  /donation/  │
│   confirm    │
└──────┬───────┘
       │ POST /api/donation/create-checkout
       │ { amount: 2500 } (in cents)
       ↓
┌──────────────────────┐
│   API Route          │
│ create-checkout      │
│ - Validates amount   │
│ - Creates session    │
│ - Returns URL        │
└──────┬───────────────┘
       │ Returns { url: "https://checkout.stripe.com/..." }
       ↓
┌─────────────┐
│   Frontend   │
│ Redirects to│
│ Stripe URL  │
└──────┬───────┘
       │
       ↓
┌─────────────┐
│   Stripe     │
│  Checkout    │
│   Page       │
└──────┬───────┘
       │ Payment completed
       ↓
┌──────────────────────┐
│  Webhook Event       │
│  /api/donation/      │
│  webhook             │
│  - Verifies signature│
│  - Processes event   │
└──────┬───────────────┘
       │
       ↓
┌─────────────┐
│  Redirect   │
│ /donation/  │
│ success or  │
│ failure     │
└─────────────┘
```

---

## API Endpoints

### 1. POST /api/donation/create-checkout

Creates a Stripe Checkout Session and returns the checkout URL.

**Request:**
```json
{
  "amount": 2500  // Amount in cents (e.g., $25.00 = 2500)
}
```

**Response (Success):**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Response (Error):**
```json
{
  "error": "Minimum donation amount is $0.50"
}
```

**Validation:**
- Minimum amount: $0.50 (50 cents)
- Amount must be a positive number

---

### 2. POST /api/donation/webhook

Handles Stripe webhook events. This endpoint verifies the webhook signature and processes payment events.

**Events Handled:**
- `checkout.session.completed` - Payment successfully completed
- `payment_intent.succeeded` - Payment intent succeeded
- `payment_intent.payment_failed` - Payment failed

**Response:**
```json
{
  "received": true
}
```

**Security:**
- Verifies webhook signature using `STRIPE_WEBHOOK_SECRET`
- Returns 400 if signature verification fails

---

### 3. GET /api/donation/verify-session

Verifies a payment session and returns donation details.

**Query Parameters:**
- `session_id` (required) - Stripe Checkout Session ID

**Response (Success):**
```json
{
  "success": true,
  "donation": {
    "amount": 2500,
    "email": "donor@example.com"
  }
}
```

**Response (Error):**
```json
{
  "error": "Payment not completed"
}
```

---

## Pages & Components

### 1. /donation/confirm

**File**: `src/app/donation/confirm/page.tsx`

**Purpose**: Allows users to select or enter their donation amount before proceeding to payment.

**Features:**
- Preset amount options: $10, $25, $50, $100, $250, $500
- Custom amount input
- Form validation
- Error handling
- Loading states

**User Actions:**
- Select preset amount from dropdown
- Enter custom amount
- Cancel (goes back)
- Proceed to Payment (creates checkout session)

---

### 2. /donation/success

**File**: `src/app/donation/success/page.tsx`

**Purpose**: Displays payment confirmation after successful donation.

**Features:**
- Payment verification via session ID
- Displays donation amount
- Shows donor email (if available)
- Links to return home or make another donation
- Contact information

**Query Parameters:**
- `session_id` - Stripe Checkout Session ID (used for verification)

---

### 3. /donation/failure

**File**: `src/app/donation/failure/page.tsx`

**Purpose**: Displays message when payment is cancelled or fails.

**Features:**
- Clear error messaging
- Option to retry donation
- Link to return home
- Contact support link

---

### 4. DonationForm Component

**File**: `src/layouts/components/DonationForm.tsx`

**Purpose**: Simplified donation form that redirects to confirmation page.

**Current Implementation:**
- Displays donation description
- Single "Donate Now" button
- Redirects to `/donation/confirm`

---

## Testing Guide

### Local Testing Setup

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Set Up Webhook Testing**
   
   **Option A: Using Stripe CLI (Recommended)**
   ```bash
   # Install Stripe CLI
   # macOS: brew install stripe/stripe-cli/stripe
   # Linux: See https://stripe.com/docs/stripe-cli
   
   # Forward webhooks to local server
   stripe listen --forward-to localhost:3000/api/donation/webhook
   ```
   
   This will give you a webhook secret starting with `whsec_` that you can use in `.env.local`

   **Option B: Using ngrok**
   ```bash
   # Install ngrok
   # Create tunnel
   ngrok http 3000
   
   # Use the ngrok URL in Stripe webhook settings
   # Example: https://abc123.ngrok.io/api/donation/webhook
   ```

### Test Card Numbers

Use these test card numbers from Stripe:

| Card Number | Result | Description |
|------------|--------|-------------|
| `4242 4242 4242 4242` | Success | Standard test card |
| `4000 0000 0000 0002` | Decline | Card declined |
| `4000 0025 0000 3155` | Requires Authentication | 3D Secure |
| `4000 0000 0000 9995` | Insufficient Funds | Insufficient funds |

**Test Card Details:**
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Testing Checklist

- [ ] Can access `/donation/confirm` page
- [ ] Can select preset donation amounts
- [ ] Can enter custom donation amount
- [ ] Form validation works (minimum amount, required fields)
- [ ] Redirects to Stripe Checkout after submission
- [ ] Can complete payment with test card
- [ ] Successfully redirects to `/donation/success` after payment
- [ ] Session verification works on success page
- [ ] Can cancel payment and redirects to `/donation/failure`
- [ ] Webhook events are received and logged
- [ ] Error messages display correctly

### Testing Payment Flow

1. Navigate to any "Donate Now" button
2. Should redirect to `/donation/confirm`
3. Select an amount (e.g., $25)
4. Click "Proceed to Payment"
5. Should redirect to Stripe Checkout
6. Enter test card: `4242 4242 4242 4242`
7. Complete payment
8. Should redirect to `/donation/success`
9. Verify amount and email are displayed

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Switch to live Stripe keys (`sk_live_...`)
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Set up production webhook endpoint in Stripe Dashboard
- [ ] Add `STRIPE_WEBHOOK_SECRET` for production webhook
- [ ] Test payment flow in production environment
- [ ] Verify HTTPS is enabled
- [ ] Check that `.env.local` is not committed to git
- [ ] Set environment variables in deployment platform (Vercel, etc.)

### Environment Variables for Production

```env
STRIPE_SECRET_KEY=sk_live_...  # Live secret key
STRIPE_WEBHOOK_SECRET=whsec_...  # Production webhook secret
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Deployment Platforms

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add all three environment variables
3. Redeploy the application

#### Other Platforms
- Add environment variables in your platform's settings
- Ensure `NEXT_PUBLIC_BASE_URL` is set correctly
- Restart the application after adding variables

### Webhook Setup for Production

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://yourdomain.com/api/donation/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** and add to environment variables

---

## Troubleshooting

### Common Issues

#### 1. Payment Not Redirecting

**Symptoms**: Clicking "Proceed to Payment" doesn't redirect to Stripe

**Solutions**:
- Check browser console for errors
- Verify `STRIPE_SECRET_KEY` is set correctly
- Check that `NEXT_PUBLIC_BASE_URL` is set
- Verify API route is accessible: `http://localhost:3000/api/donation/create-checkout`

#### 2. Webhook Not Working

**Symptoms**: Webhook events not being received

**Solutions**:
- Verify webhook URL is publicly accessible
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Verify webhook signature verification in server logs
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/donation/webhook`
- Check server logs for webhook errors

#### 3. Session Verification Failing

**Symptoms**: Success page shows "Payment not completed"

**Solutions**:
- Verify `STRIPE_SECRET_KEY` is correct
- Check that session ID is being passed in URL
- Verify session exists in Stripe Dashboard
- Check server logs for verification errors

#### 4. "Stripe secret key is not configured" Error

**Solutions**:
- Ensure `.env.local` file exists in project root
- Verify `STRIPE_SECRET_KEY` is set
- Restart Next.js development server
- Check for typos in variable name

#### 5. CORS or Network Errors

**Solutions**:
- Verify API routes are accessible
- Check network tab in browser DevTools
- Ensure server is running on correct port
- Check for firewall or proxy issues

### Debugging Tips

1. **Check Server Logs**
   ```bash
   # Next.js logs will show API route errors
   npm run dev
   ```

2. **Check Stripe Dashboard**
   - Go to **Payments** to see payment attempts
   - Check **Webhooks** for event delivery status
   - Review **Logs** for API errors

3. **Browser DevTools**
   - Check Console for JavaScript errors
   - Check Network tab for failed API requests
   - Verify request/response payloads

4. **Stripe CLI**
   ```bash
   # View webhook events
   stripe listen --forward-to localhost:3000/api/donation/webhook
   
   # Trigger test events
   stripe trigger checkout.session.completed
   ```

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env.local` to version control
- ✅ Use different keys for test and production
- ✅ Rotate keys regularly
- ✅ Use secret management services in production

### 2. API Security
- ✅ Webhook signature verification is implemented
- ✅ Server-side validation of amounts
- ✅ HTTPS required in production
- ✅ No sensitive data in client-side code

### 3. Payment Security
- ✅ All payments processed through Stripe (PCI compliant)
- ✅ No card data stored on server
- ✅ Session verification before showing success
- ✅ Secure redirect URLs

### 4. Code Security
- ✅ Input validation on all forms
- ✅ Error messages don't expose sensitive info
- ✅ Rate limiting recommended (add if needed)
- ✅ Regular dependency updates

### 5. Monitoring
- ✅ Monitor webhook delivery in Stripe Dashboard
- ✅ Set up alerts for failed payments
- ✅ Log payment events for audit trail
- ✅ Monitor API route errors

---

## Additional Resources

### Stripe Documentation
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe API Reference](https://stripe.com/docs/api)

### Support
- **Stripe Support**: https://support.stripe.com
- **Stripe Status**: https://status.stripe.com
- **Stripe Discord**: https://discord.gg/stripe

### Project Files
- Quick Setup: `STRIPE_SETUP.md`
- This Documentation: `STRIPE_INTEGRATION_DOCUMENTATION.md`
- Environment Variables: `.env.local` (not in git)

---

## Version History

- **v1.0** (2024-12-21): Initial Stripe integration
  - Donation confirmation page
  - Stripe Checkout integration
  - Success/failure pages
  - Webhook handling
  - Session verification

---

## Notes

- This integration uses Stripe Checkout (hosted payment page)
- All payment processing is handled by Stripe
- No PCI compliance required on your server
- Webhook secret must be configured for production
- Test mode uses test keys (no real charges)

---

**Last Updated**: December 21, 2024
**Maintained By**: Development Team
**Status**: ✅ Production Ready (after webhook configuration)
