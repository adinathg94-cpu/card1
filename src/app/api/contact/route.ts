import { NextResponse } from 'next/server';

// Mailgun integration for sending contact form emails.
// The handler reads MAILGUN_API_KEY and MAILGUN_DOMAIN from environment variables.
// If MAILGUN_API_KEY is not set, it will fall back to the provided key.

const FALLBACK_API_KEY = 'fece5aa9d01e3e83a9b51e42761fac11-96164d60-7bd89461';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, mobile, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.MAILGUN_API_KEY || FALLBACK_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN || 'mg.example.com';

    const auth = 'Basic ' + Buffer.from('api:' + apiKey).toString('base64');

    const text = message + "\n\n---\nName: " + name + "\nEmail: " + email + "\nMobile: " + (mobile || 'N/A');

    const params = new URLSearchParams();
    params.append('from', `Website Contact <contact@${domain}>`);
    params.append('to', 'card.dir@marthoma.in');
    params.append('subject', `Website Contact: ${name}`);
    params.append('text', text);

    const resp = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json({ error: 'Mailgun error', details: errText }, { status: 502 });
    }

    return NextResponse.json({ ok: true, message: 'Message sent' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error', details: err?.message || String(err) }, { status: 500 });
  }
}
