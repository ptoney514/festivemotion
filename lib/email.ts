import "server-only";

type OrderEmailItem = {
  label: string;
  quantity: number;
  totalCents: number;
};

type SendOrderEmailArgs = {
  amountTotalCents: number;
  customerEmail: string | null;
  orderId: string;
  productName: string;
  items?: OrderEmailItem[];
};

function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function buildPlainText(args: SendOrderEmailArgs): string {
  const lines = [
    `New FestiveMotion Order`,
    ``,
    `Order ID: ${args.orderId}`,
    `Customer: ${args.customerEmail ?? "N/A"}`,
    `Total: ${formatDollars(args.amountTotalCents)}`,
    ``,
  ];

  if (args.items && args.items.length > 0) {
    lines.push(`Items:`);
    for (const item of args.items) {
      lines.push(`  - ${item.label} x${item.quantity} — ${formatDollars(item.totalCents)}`);
    }
  } else {
    lines.push(`Product: ${args.productName}`);
  }

  lines.push(``, `---`, `This is an automated notification from the FestiveMotion storefront.`);
  return lines.join("\n");
}

type SendContactEmailArgs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const SUBJECT_LABELS: Record<string, string> = {
  general: "General Inquiry",
  "order-support": "Order Support",
  "custom-project": "Custom Project",
  "technical-support": "Technical Support",
};

export async function sendContactEmail(args: SendContactEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !notifyEmail) {
    console.info("sendContactEmail (no Resend key, logging to console):", args);
    return;
  }

  const subjectLabel = SUBJECT_LABELS[args.subject] ?? args.subject;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "FestiveMotion <orders@festivemotion.com>",
      to: notifyEmail,
      replyTo: args.email,
      subject: `Contact: ${subjectLabel} from ${args.name}`,
      text: [
        `Contact Form Submission`,
        ``,
        `Name: ${args.name}`,
        `Email: ${args.email}`,
        `Subject: ${subjectLabel}`,
        ``,
        `Message:`,
        args.message,
        ``,
        `---`,
        `Submitted via the FestiveMotion contact form.`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Failed to send contact email via Resend:", error);
  }
}

// --- Customer order confirmation email ---

type ShippingAddress = {
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type SendCustomerConfirmationEmailArgs = {
  orderId: string;
  amountTotalCents: number;
  customerEmail: string;
  customerName: string | null;
  shippingAddress: ShippingAddress | null;
  items: OrderEmailItem[];
};

function buildCustomerPlainText(args: SendCustomerConfirmationEmailArgs): string {
  const lines = [
    `FestiveMotion Order Confirmation`,
    ``,
    args.customerName ? `Hi ${args.customerName},` : `Hi there,`,
    ``,
    `Thank you for your order! Here are your details:`,
    ``,
    `Order ID: ${args.orderId}`,
    `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    ``,
  ];

  if (args.items.length > 0) {
    lines.push(`Items:`);
    for (const item of args.items) {
      lines.push(`  - ${item.label} x${item.quantity} — ${formatDollars(item.totalCents)}`);
    }
    lines.push(``);
  }

  lines.push(`Total: ${formatDollars(args.amountTotalCents)}`);

  if (args.shippingAddress) {
    const a = args.shippingAddress;
    lines.push(``, `Shipping to:`);
    lines.push(`  ${a.street}`);
    if (a.apt) lines.push(`  ${a.apt}`);
    lines.push(`  ${a.city}, ${a.state} ${a.zip}`);
    lines.push(`  ${a.country}`);
  }

  lines.push(
    ``,
    `Questions? Contact us:`,
    `  Email: info@festivemotion.com`,
    `  Phone: +1 402 253 1991`,
    ``,
    `---`,
    `FestiveMotion — Animatronic Skulls & Props`,
  );
  return lines.join("\n");
}

function buildCustomerHtml(args: SendCustomerConfirmationEmailArgs): string {
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const itemRows = args.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#ccc;font-size:14px">${item.label}</td>
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#ccc;font-size:14px;text-align:center">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#fff;font-size:14px;text-align:right;font-weight:600">${formatDollars(item.totalCents)}</td>
        </tr>`,
    )
    .join("");

  const shippingBlock = args.shippingAddress
    ? `<div style="margin-top:24px;padding:16px;background:#111;border-radius:8px">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Shipping Address</p>
        <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6">
          ${args.shippingAddress.street}${args.shippingAddress.apt ? `<br>${args.shippingAddress.apt}` : ""}<br>
          ${args.shippingAddress.city}, ${args.shippingAddress.state} ${args.shippingAddress.zip}<br>
          ${args.shippingAddress.country}
        </p>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#090909;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px">
    <!-- Header -->
    <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #222">
      <h1 style="margin:0;font-size:24px;font-weight:700;color:#ff5a1f;letter-spacing:-0.02em">FestiveMotion</h1>
      <p style="margin:8px 0 0;font-size:13px;color:#888">Order Confirmation</p>
    </div>

    <!-- Greeting -->
    <div style="padding:32px 0 24px">
      <p style="margin:0;font-size:16px;color:#fff">${args.customerName ? `Hi ${args.customerName},` : "Hi there,"}</p>
      <p style="margin:12px 0 0;font-size:14px;color:#aaa;line-height:1.6">Thank you for your order! We're getting things ready on our end. Here's a summary of what you ordered.</p>
    </div>

    <!-- Order meta -->
    <div style="display:flex;gap:16px;margin-bottom:24px">
      <div style="flex:1;padding:12px 16px;background:#111;border-radius:8px">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Order ID</p>
        <p style="margin:4px 0 0;font-size:14px;color:#fff;font-weight:600">${args.orderId.slice(0, 8)}</p>
      </div>
      <div style="flex:1;padding:12px 16px;background:#111;border-radius:8px">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Date</p>
        <p style="margin:4px 0 0;font-size:14px;color:#fff;font-weight:600">${orderDate}</p>
      </div>
    </div>

    <!-- Items table -->
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr>
          <th style="padding:8px 0;border-bottom:2px solid #333;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;text-align:left">Item</th>
          <th style="padding:8px 0;border-bottom:2px solid #333;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;text-align:center">Qty</th>
          <th style="padding:8px 0;border-bottom:2px solid #333;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;text-align:right">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:12px 0 0;color:#fff;font-size:16px;font-weight:700">Total</td>
          <td style="padding:12px 0 0;color:#ff5a1f;font-size:16px;font-weight:700;text-align:right">${formatDollars(args.amountTotalCents)}</td>
        </tr>
      </tfoot>
    </table>

    ${shippingBlock}

    <!-- Support -->
    <div style="margin-top:32px;padding:16px;background:#111;border-radius:8px;text-align:center">
      <p style="margin:0 0 4px;font-size:13px;color:#aaa">Questions about your order?</p>
      <p style="margin:0;font-size:13px;color:#ccc">
        <a href="mailto:info@festivemotion.com" style="color:#ff5a1f;text-decoration:none">info@festivemotion.com</a>
        &nbsp;&middot;&nbsp; +1 402 253 1991
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #222;text-align:center">
      <p style="margin:0;font-size:12px;color:#555">FestiveMotion &mdash; Animatronic Skulls &amp; Props</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendCustomerConfirmationEmail(args: SendCustomerConfirmationEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info("sendCustomerConfirmationEmail (no Resend key, logging to console):", {
      to: args.customerEmail,
      orderId: args.orderId,
      total: formatDollars(args.amountTotalCents),
    });
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "FestiveMotion <orders@festivemotion.com>",
      to: args.customerEmail,
      subject: `FestiveMotion Order Confirmation — ${args.orderId.slice(0, 8)}`,
      html: buildCustomerHtml(args),
      text: buildCustomerPlainText(args),
    });
  } catch (error) {
    console.error("Failed to send customer confirmation email via Resend:", error);
  }
}

export async function sendOrderEmail(args: SendOrderEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !notifyEmail) {
    console.info("sendOrderEmail (no Resend key, logging to console):", args);
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "FestiveMotion <orders@festivemotion.com>",
      to: notifyEmail,
      subject: `New Order ${args.orderId.slice(0, 8)} — ${formatDollars(args.amountTotalCents)}`,
      text: buildPlainText(args),
    });
  } catch (error) {
    console.error("Failed to send order email via Resend:", error);
  }
}
