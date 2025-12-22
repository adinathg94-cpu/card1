import paypal from '@paypal/checkout-server-sdk';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// For production, use LiveEnvironment
// const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);

const client = new paypal.core.PayPalHttpClient(environment);

export default client;
