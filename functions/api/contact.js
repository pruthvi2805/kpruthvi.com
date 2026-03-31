const TO_EMAIL = "me@kpruthvi.com";
const FROM_EMAIL = "noreply@kpruthvi.com";
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, request);
  }

  if (!isAllowedOrigin(request)) {
    return jsonResponse({ error: "Origin not allowed" }, 403, request);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return jsonResponse({ error: "Content-Type must be application/json" }, 415, request);
  }

  let data;

  try {
    data = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON payload" }, 400, request);
  }

  const name = normalizeText(data.name, MAX_NAME_LENGTH);
  const email = normalizeEmail(data.email);
  const message = normalizeMessage(data.message, MAX_MESSAGE_LENGTH);
  const website = normalizeText(data.website, 500);

  if (website) {
    return jsonResponse({ success: true, message: "Message sent successfully!" }, 200, request);
  }

  if (!name || !email || !message) {
    return jsonResponse({ error: "All fields are required" }, 400, request);
  }

  if (name.length > MAX_NAME_LENGTH || email.length > MAX_EMAIL_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ error: "One or more fields are too long" }, 400, request);
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ error: "Please enter a valid email address" }, 400, request);
  }

  if (!env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY secret");
    return jsonResponse({ error: "Email service is not configured" }, 500, request);
  }

  const emailSent = await sendEmail({ name, email, message, resendApiKey: env.RESEND_API_KEY });
  if (!emailSent) {
    return jsonResponse({ error: "Failed to send email. Please try again later." }, 500, request);
  }

  return jsonResponse({ success: true, message: "Message sent successfully!" }, 200, request);
}

function handleOptions(request) {
  if (!isAllowedOrigin(request)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

function isAllowedOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) {
    return true;
  }

  let url;

  try {
    url = new URL(origin);
  } catch {
    return false;
  }

  const allowedHosts = new Set([
    "www.kpruthvi.com",
    "kpruthvi.com",
    "localhost",
    "127.0.0.1",
  ]);

  if (allowedHosts.has(url.hostname)) {
    return true;
  }

  return url.hostname.endsWith(".pages.dev");
}

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };

  if (origin && isAllowedOrigin(request)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function jsonResponse(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request),
    },
  });
}

async function sendEmail({ name, email, message, resendApiKey }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: `Portfolio Contact <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      reply_to: email,
      subject: `Portfolio Contact: ${name}`,
      html: buildEmailHtml({ name, email, message }),
    }),
  });

  return response.ok;
}

function buildEmailHtml({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #007aff; margin-bottom: 24px;">New Contact Form Submission</h2>
      <div style="background: #f5f5f7; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0;"><strong>From:</strong> ${safeName}</p>
        <p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #007aff;">${safeEmail}</a></p>
      </div>
      <div style="background: #ffffff; border: 1px solid #d2d2d7; border-radius: 12px; padding: 20px;">
        <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
        <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
      </div>
    </div>
  `;
}

function normalizeText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeMessage(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function normalizeEmail(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase().slice(0, MAX_EMAIL_LENGTH);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
