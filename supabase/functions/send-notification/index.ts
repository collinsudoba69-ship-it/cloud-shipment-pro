// Edge function: send-notification
// Sends branded transactional emails via Brevo to users and/or non-users.
// Requires a valid JWT (admin panel calls, or service-role calls from DB triggers).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SENDER = { name: "Cloud Shipment", email: "noreply@notify.cloudshipmentexpress.online" };
const BRAND_COLOR = "#0a1f44";
const ACCENT_COLOR = "#2563eb";
const SITE_URL = "https://cloudshipmentexpress.online";
const LOGO_URL = "https://cloudshipmentexpress.online/cloud-shipment-logo.png";

interface Recipient {
  email: string;
  name?: string;
}

function ctaButton(label: string, url: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr><td style="background:${ACCENT_COLOR};border-radius:8px;">
        <a href="${url}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:bold;text-decoration:none;font-size:14px;">${label}</a>
      </td></tr>
    </table>`;
}

function wrapEmail(bodyHtml: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">
  <span style="display:none;font-size:1px;color:#f4f6fb;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:${BRAND_COLOR};padding:24px 32px;text-align:center;">
          <img src="${LOGO_URL}" alt="Cloud Shipment" height="36" style="height:36px;display:inline-block;" />
        </td></tr>
        <tr><td style="padding:32px;color:#1f2937;font-size:15px;line-height:1.6;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f9fafb;color:#9ca3af;font-size:12px;text-align:center;">
          &copy; Cloud Shipment &middot; <a href="${SITE_URL}" style="color:#9ca3af;">cloudshipmentexpress.online</a><br>
          This is an automated message. Please do not reply to this email.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function statusUpdateTemplate(data: any): { subject: string; html: string } {
  const { trackingNumber, status, location, receiverName } = data;
  const trackUrl = `${SITE_URL}/track?tn=${encodeURIComponent(trackingNumber)}`;
  const body = `
    <p>Hi ${receiverName || "there"},</p>
    <p>Your shipment <strong>${trackingNumber}</strong> has a new status update:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      <tr><td style="background:#eff6ff;border-radius:8px;padding:16px;">
        <span style="color:${ACCENT_COLOR};font-weight:bold;text-transform:capitalize;">${status.replace(/_/g, " ")}</span>
        ${location ? `<br><span style="color:#6b7280;font-size:13px;">${location}</span>` : ""}
      </td></tr>
    </table>
    ${ctaButton("Track Shipment", trackUrl)}
    <p style="color:#6b7280;font-size:13px;">Or visit ${SITE_URL} and enter tracking number ${trackingNumber}.</p>`;
  return { subject: `Shipment ${trackingNumber} update: ${status.replace(/_/g, " ")}`, html: wrapEmail(body, "Your shipment status has changed") };
}

function formatDate(d: string | null | undefined): string {
  if (!d) return "To be confirmed";
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  } catch {
    return String(d);
  }
}

function currentStatusLine(data: any): string {
  const { paymentStatus, paymentReason, statusLabel } = data;
  if (paymentStatus && paymentStatus.toLowerCase() !== "paid") {
    return `Awaiting ${paymentReason || "Payment"}`;
  }
  return statusLabel || "Processing";
}

function newShipmentTemplate(data: any): { subject: string; html: string } {
  const {
    trackingNumber, receiverName, senderName, courier,
    estimatedDeliveryDate, quantity, weight,
    amountToPay, paymentMethod, paymentStatus, paymentReason,
  } = data;
  const trackUrl = `${SITE_URL}/track?tn=${encodeURIComponent(trackingNumber)}`;

  const body = `
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Shipment is on its way</h2>
    <p>Dear ${receiverName || "Customer"},</p>
    <p>Your shipment with waybill number:</p>
    <p style="font-size:18px;font-weight:bold;color:${ACCENT_COLOR};margin:4px 0 16px;">${trackingNumber}</p>
    <p>from <strong>${senderName || "-"}</strong> is scheduled for delivery.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr><td style="background:#f9fafb;border-radius:8px;padding:16px;">
        <p style="margin:0 0 10px;"><strong>Estimated Delivery Date:</strong><br>${formatDate(estimatedDeliveryDate)}</p>
        <p style="margin:0 0 10px;"><strong>Current Status:</strong><br>${currentStatusLine(data)}</p>
        <p style="margin:0;"><strong>Service:</strong> ${courier || "Cloud Shipment"}</p>
      </td></tr>
    </table>

    ${ctaButton("Track Shipment", trackUrl)}

    <h3 style="margin:28px 0 12px;color:${BRAND_COLOR};font-size:16px;border-top:1px solid #e5e7eb;padding-top:20px;">Shipment Invoice</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <tr><td style="padding:10px 14px;background:#f9fafb;color:#6b7280;font-size:13px;">Waybill Number</td><td style="padding:10px 14px;text-align:right;font-size:13px;">${trackingNumber}</td></tr>
      <tr><td style="padding:10px 14px;color:#6b7280;font-size:13px;">Quantity</td><td style="padding:10px 14px;text-align:right;font-size:13px;">${quantity ?? "-"}</td></tr>
      ${weight ? `<tr><td style="padding:10px 14px;background:#f9fafb;color:#6b7280;font-size:13px;">Weight</td><td style="padding:10px 14px;text-align:right;font-size:13px;">${weight}</td></tr>` : ""}
      <tr><td style="padding:10px 14px;${weight ? "" : "background:#f9fafb;"}color:#6b7280;font-size:13px;">Payment Method</td><td style="padding:10px 14px;text-align:right;font-size:13px;">${paymentMethod || "-"}</td></tr>
      <tr><td style="padding:10px 14px;background:#f9fafb;color:#6b7280;font-size:13px;">Payment Status</td><td style="padding:10px 14px;text-align:right;font-size:13px;text-transform:capitalize;">${paymentStatus || "-"}</td></tr>
      <tr><td style="padding:12px 14px;color:${BRAND_COLOR};font-weight:bold;font-size:14px;">Amount Due</td><td style="padding:12px 14px;text-align:right;color:${BRAND_COLOR};font-weight:bold;font-size:14px;">${amountToPay ?? "-"}</td></tr>
    </table>`;

  return { subject: `Shipment ${trackingNumber} is on its way`, html: wrapEmail(body, "Your shipment is on its way") };
}

function paymentUpdateTemplate(data: any): { subject: string; html: string } {
  const { trackingNumber, amount, reason, receiverName } = data;
  const trackUrl = `${SITE_URL}/track?tn=${encodeURIComponent(trackingNumber)}`;
  const body = `
    <p>Hi ${receiverName || "there"},</p>
    <p>A payment update is available for shipment <strong>${trackingNumber}</strong>:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      <tr><td style="background:#fef9c3;border-radius:8px;padding:16px;">
        <p style="margin:0 0 8px;"><strong>Amount:</strong> ${amount}</p>
        ${reason ? `<p style="margin:0;"><strong>Reason:</strong> ${reason}</p>` : ""}
      </td></tr>
    </table>
    ${ctaButton("View Shipment", trackUrl)}`;
  return { subject: `Payment update for shipment ${trackingNumber}`, html: wrapEmail(body, "Payment update available") };
}

function customTemplate(data: any): { subject: string; html: string } {
  const { subject, message, receiverName } = data;
  const body = `
    <p>Hi ${receiverName || "there"},</p>
    <div>${(message || "").replace(/\n/g, "<br>")}</div>
    ${ctaButton("Visit Cloud Shipment", SITE_URL)}`;
  return { subject: subject || "Update from Cloud Shipment", html: wrapEmail(body, subject || "") };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients, type, data } = await req.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(JSON.stringify({ error: "Missing 'recipients' array." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!type) {
      return new Response(JSON.stringify({ error: "Missing 'type'." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) {
      return new Response(JSON.stringify({ error: "BREVO_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let built: { subject: string; html: string };
    switch (type) {
      case "status_update":
        built = statusUpdateTemplate(data || {});
        break;
      case "new_shipment":
        built = newShipmentTemplate(data || {});
        break;
      case "payment_update":
        built = paymentUpdateTemplate(data || {});
        break;
      case "custom":
        built = customTemplate(data || {});
        break;
      default:
        return new Response(JSON.stringify({ error: `Unknown type '${type}'.` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const results = [];
    for (const r of recipients as Recipient[]) {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: SENDER,
          to: [{ email: r.email, name: r.name || undefined }],
          subject: built.subject,
          htmlContent: built.html,
        }),
      });
      const body = await res.json().catch(() => ({}));
      results.push({ email: r.email, ok: res.ok, status: res.status, body });
    }

    const failed = results.filter((r) => !r.ok);
    return new Response(
      JSON.stringify({ sent: results.length - failed.length, failed: failed.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("send-notification error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
