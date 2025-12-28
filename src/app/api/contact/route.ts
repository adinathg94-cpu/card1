import { NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(req: Request) {
  // Check rate limit: 10 contact submissions per hour
  const rateLimit = checkRateLimit(req, {
    maxRequests: 10,
    windowSeconds: 60 * 60, // 1 hour
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: createRateLimitHeaders(rateLimit)
      }
    );
  }

  try {
    // Robust body parsing: support JSON and form-encoded bodies and return clear errors
    let body: any = {};
    const contentType = (req.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('application/json')) {
      try {
        body = await req.json();
      } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text();
      body = Object.fromEntries(new URLSearchParams(text));
    } else {
      // try to parse defensively: prefer JSON, fallback to urlencoded
      const text = await req.text();
      if (!text) return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
      try {
        body = JSON.parse(text);
      } catch {
        body = Object.fromEntries(new URLSearchParams(text));
      }
    }

    const { name, email, mobile, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Sanitize inputs to prevent injection
    const sanitizedName = String(name).trim().substring(0, 100);
    const sanitizedEmail = String(email).trim().toLowerCase().substring(0, 100);
    const sanitizedMobile = mobile ? String(mobile).trim().substring(0, 20) : 'N/A';
    const sanitizedMessage = String(message).trim().substring(0, 5000);

    // Validate environment variables are set
    if (!process.env.MAILGUN_API_KEY) {
      console.error('MAILGUN_API_KEY environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const apiKey = process.env.MAILGUN_API_KEY.trim();
    // sanitize domain: remove protocol and trailing slash if present
    const rawDomain = process.env.MAILGUN_DOMAIN || 'mg.example.com';
    const domain = rawDomain.replace(/^https?:\/\//i, '').replace(/\/$/, '').trim();
    const recipient = (process.env.CONTACT_RECIPIENT || 'card.dir@marthoma.in').trim();

    const auth = 'Basic ' + Buffer.from('api:' + apiKey).toString('base64');

    const text = `${sanitizedMessage}\n\n---\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nMobile: ${sanitizedMobile}`;

    const params = new URLSearchParams();
    params.append('from', `Website Contact <contact@${domain}>`);
    params.append('to', recipient);
    params.append('subject', `Website Contact: ${sanitizedName}`);
    params.append('text', text);

    const mailgunBase = (process.env.MAILGUN_BASE_URL || 'https://api.mailgun.net').replace(/\/$/, '');
    const endpoint = `${mailgunBase}/v3/${domain}/messages`;

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!resp.ok) {
      const contentType = resp.headers.get('content-type') || '';
      const errText = contentType.includes('application/json') ? await resp.json() : await resp.text();
      console.error('Mailgun error response:', errText);
      return NextResponse.json({ error: 'Mailgun error', details: errText }, { status: 502 });
    }

    return NextResponse.json({ ok: true, message: 'Message sent' }, { status: 200 });
  } catch (err: any) {
    // log error server-side (do not leak secrets to clients)
    console.error('Contact form send error:', err);
    return NextResponse.json({ error: 'Server error', details: err?.message || String(err) }, { status: 500 });
  }
}
