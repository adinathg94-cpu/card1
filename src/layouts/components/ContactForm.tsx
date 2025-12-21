"use client";

import { useState } from "react";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!name || !email || !message) {
      setStatus({ ok: false, msg: "Please fill required fields." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile, message })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: data.message || 'Message sent successfully.' });
        setName(''); setEmail(''); setMobile(''); setMessage('');
      } else {
        setStatus({ ok: false, msg: data.error || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ ok: false, msg: 'Unexpected error. Please try later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="name" className="form-label">
          Your Full Name <span>*</span>
        </label>
        <input
          id="name"
          name="name"
          className="form-input"
          placeholder="John Doe"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="form-label">
          Your Email <span>*</span>
        </label>
        <input
          id="email"
          name="email"
          className="form-input"
          placeholder="john.doe@email.com"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="mobile" className="form-label">
          Mobile Number (optional)
        </label>
        <input
          id="mobile"
          name="mobile"
          className="form-input"
          placeholder="+91 98765 43210"
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="form-label">
          Your Message <span>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          className="form-input"
          placeholder="Write your message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      {status && (
        <div className={`mb-4 ${status.ok ? 'text-success' : 'text-error'}`}>{status.msg}</div>
      )}

      <button type="submit" className="btn btn-primary w-full text-center" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
