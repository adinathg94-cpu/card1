import { NextResponse } from 'next/server';

// Fallback key (only used if no env var provided). Replace with your own safe default if necessary.
const FALLBACK_API_KEY = 'fece5aa9d01e3e83a9b51e42761fac11-96164d60-7bd89461';

export async function POST(req: Request) {
  try {
    // Robust body parsing: support JSON and form-encoded bodies and return clear errors
    let body: any = {};
    const contentType = (req.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('application/json')) {
      try {
        body = await req.json();
      } catch (e) {
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
      } catch (_e) {
        body = Object.fromEntries(new URLSearchParams(text));
      }
    }

    const { name, email, mobile, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = (process.env.MAILGUN_API_KEY || FALLBACK_API_KEY).trim();
    // sanitize domain: remove protocol and trailing slash if present
    const rawDomain = process.env.MAILGUN_DOMAIN || 'mg.example.com';
    const domain = rawDomain.replace(/^https?:\/\//i, '').replace(/\/$/, '').trim();
    const recipient = (process.env.CONTACT_RECIPIENT || 'card.dir@marthoma.in').trim();

    const auth = 'Basic ' + Buffer.from('api:' + apiKey).toString('base64');

    const text = `${message}\n\n---\nName: ${name}\nEmail: ${email}\nMobile: ${mobile || 'N/A'}`;

    const params = new URLSearchParams();
    params.append('from', `Website Contact <contact@${domain}>`);
    params.append('to', recipient);
    params.append('subject', `Website Contact: ${name}`);
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
      // eslint-disable-next-line no-console
      console.error('Mailgun error response:', errText);
      return NextResponse.json({ error: 'Mailgun error', details: errText }, { status: 502 });
    }

    return NextResponse.json({ ok: true, message: 'Message sent' }, { status: 200 });
  } catch (err: any) {
    // log error server-side (do not leak secrets to clients)
    // eslint-disable-next-line no-console
    console.error('Contact form send error:', err);
    return NextResponse.json({ error: 'Server error', details: err?.message || String(err) }, { status: 500 });
  }
}
