# Stripe Payment Integration Setup

This document explains how to set up Stripe payment gateway for donations on the CARD website.

## Environment Variables

Add the following environment variables to your `.env.local` file (or your deployment platform's environment variables):

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe Secret Key (use sk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_...  # Your Stripe Webhook Secret
NEXT_PUBLIC_BASE_URL=https://yourdomain.com  # Your website URL (for production)
```

### Getting Your Stripe Keys

1. **Create a Stripe Account**: Sign up at [https://stripe.com](https://stripe.com)

2. **Get Your Secret Key**:
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Navigate to **Developers** → **API keys**
   - Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for production)

3. **Set Up Webhook**:
   - Go to **Developers** → **Webhooks** in Stripe Dashboard
   - Click **Add endpoint**
   - Enter your webhook URL: `https://yourdomain.com/api/donation/webhook`
   - Select events to listen to:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the **Signing secret** (starts with `whsec_`) and add it to `STRIPE_WEBHOOK_SECRET`

4. **Set Base URL**:
   - For local development: `http://localhost:3000`
   - For production: Your actual domain (e.g., `https://card-ngo.org`)

## Payment Flow

1. **User clicks "Donate Now"** → Redirects to `/donation/confirm`
2. **User selects/enters donation amount** → Submits form
3. **System creates Stripe Checkout Session** → Redirects to Stripe payment page
4. **User completes payment** → Stripe redirects to:
   - Success: `/donation/success?session_id={CHECKOUT_SESSION_ID}`
   - Failure: `/donation/failure`

## Testing

### Test Mode
- Use test API keys (starting with `sk_test_`)
- Use test card numbers from [Stripe Testing](https://stripe.com/docs/testing)
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
  - Use any future expiry date, any CVC, and any ZIP code

### Production
- Switch to live API keys (starting with `sk_live_`)
- Update webhook endpoint to production URL
- Ensure `NEXT_PUBLIC_BASE_URL` points to your production domain

## Security Notes

- **Never commit** `.env.local` or `.env` files to version control
- Keep your Stripe secret keys secure
- Use environment variables for all sensitive configuration
- Enable HTTPS in production
- Regularly rotate your API keys

## Troubleshooting

### Payment not redirecting
- Check that `NEXT_PUBLIC_BASE_URL` is set correctly
- Verify Stripe API keys are correct
- Check browser console for errors

### Webhook not working
- Ensure webhook URL is publicly accessible
- Verify webhook secret matches Stripe dashboard
- Check server logs for webhook errors
- Test webhook using Stripe CLI: `stripe listen --forward-to localhost:3000/api/donation/webhook`

### Session verification failing
- Ensure `STRIPE_SECRET_KEY` is set correctly
- Check that session ID is being passed correctly in URL

## Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Support](https://support.stripe.com)
