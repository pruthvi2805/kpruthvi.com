/**
 * Cloudflare Worker for Contact Form
 * Handles form submissions with Turnstile verification and email sending
 */

const TURNSTILE_SECRET = '0x4AAAAAACNQM_xprD8ZVC4ST35RTmXNaPw';
const TO_EMAIL = 'me@kpruthvi.com';
const FROM_EMAIL = 'noreply@kpruthvi.com';

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
      const data = await request.json();
      const { name, email, message, 'cf-turnstile-response': token } = data;

      // Validate required fields
      if (!name || !email || !message || !token) {
        return jsonResponse({ error: 'All fields are required' }, 400);
      }

      // Verify Turnstile token
      const turnstileValid = await verifyTurnstile(token, request);
      if (!turnstileValid) {
        return jsonResponse({ error: 'Spam protection check failed. Please try again.' }, 400);
      }

      // Send email via MailChannels
      const emailSent = await sendEmail(name, email, message);
      if (!emailSent) {
        return jsonResponse({ error: 'Failed to send email. Please try again later.' }, 500);
      }

      return jsonResponse({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({ error: 'An unexpected error occurred' }, 500);
    }
  },
};

async function verifyTurnstile(token, request) {
  const ip = request.headers.get('CF-Connecting-IP');
  
  const formData = new URLSearchParams();
  formData.append('secret', TURNSTILE_SECRET);
  formData.append('response', token);
  formData.append('remoteip', ip);

  try {
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });

    const data = await result.json();
    return data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

async function sendEmail(name, email, message) {
  const emailContent = {
    personalizations: [
      {
        to: [{ email: TO_EMAIL, name: 'Pruthvi Kauticwar' }],
        subject: `Portfolio Contact: ${name}`,
      },
    ],
    from: {
      email: FROM_EMAIL,
      name: 'Portfolio Contact Form',
    },
    reply_to: {
      email: email,
      name: name,
    },
    content: [
      {
        type: 'text/plain',
        value: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      },
      {
        type: 'text/html',
        value: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #007aff; margin-bottom: 24px;">New Contact Form Submission</h2>
            <div style="background: #f5f5f7; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
              <p style="margin: 0 0 8px 0;"><strong>From:</strong> ${name}</p>
              <p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007aff;">${email}</a></p>
            </div>
            <div style="background: #ffffff; border: 1px solid #d2d2d7; border-radius: 12px; padding: 20px;">
              <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `,
      },
    ],
  };

  try {
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailContent),
    });

    return response.ok;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
