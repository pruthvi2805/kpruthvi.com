/**
 * Cloudflare Worker for Contact Form
 * Handles form submissions with honeypot spam protection and email sending via Resend
 */

const TO_EMAIL = 'me@kpruthvi.com';
const FROM_EMAIL = 'noreply@kpruthvi.com';

export default {
  async fetch(request, env) {
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
      const { name, email, message, website } = data;

      // Honeypot check - if 'website' field is filled, it's a bot
      if (website) {
        // Pretend success to not alert the bot
        return jsonResponse({ success: true, message: 'Message sent successfully!' });
      }

      // Validate required fields
      if (!name || !email || !message) {
        return jsonResponse({ error: 'All fields are required' }, 400);
      }

      // Send email via Resend
      const emailSent = await sendEmail(name, email, message, env);
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

async function sendEmail(name, email, message, env) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Portfolio Contact <${FROM_EMAIL}>`,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Portfolio Contact: ${name}`,
        html: `
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
      }),
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
