import "server-only";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type OrderEmailItem = {
  label: string;
  quantity: number;
  totalCents: number;
};

type SendOrderEmailArgs = {
  amountTotalCents: number;
  customerEmail: string | null;
  customerName: string | null;
  customerPhone: string | null;
  orderId: string;
  productName: string;
  items?: OrderEmailItem[];
  shippingAddress?: ShippingAddress | null;
  billingAddress?: ShippingAddress | null;
  orderNotes?: string | null;
  promoCode?: string | null;
  discountAmountCents?: number | null;
  subtotalCents?: number | null;
  shippingFeeCents?: number | null;
  taxAmountCents?: number | null;
  stripePaymentIntentId?: string | null;
};

function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function buildAdminPlainText(args: SendOrderEmailArgs): string {
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines = [
    `New FestiveMotion Order`,
    ``,
    `Order ID: ${args.orderId}`,
  ];

  if (args.stripePaymentIntentId) {
    lines.push(`Payment: ${args.stripePaymentIntentId}`);
  }
  lines.push(`Date: ${orderDate}`);

  lines.push(``, `Customer:`);
  lines.push(`  Name: ${args.customerName ?? "N/A"}`);
  lines.push(`  Email: ${args.customerEmail ?? "N/A"}`);
  lines.push(`  Phone: ${args.customerPhone ?? "N/A"}`);

  lines.push(``);

  if (args.items && args.items.length > 0) {
    lines.push(`Items:`);
    let subtotalCents = args.subtotalCents ?? 0;
    if (!args.subtotalCents) {
      subtotalCents = 0;
      for (const item of args.items) subtotalCents += item.totalCents;
    }
    for (const item of args.items) {
      lines.push(`  - ${item.label} x${item.quantity} — ${formatDollars(item.totalCents)}`);
    }
    lines.push(``);
    lines.push(`Subtotal: ${formatDollars(subtotalCents)}`);
    if (args.promoCode && args.discountAmountCents) {
      lines.push(`Promo: ${args.promoCode} — -${formatDollars(args.discountAmountCents)}`);
    }
    if (args.shippingFeeCents != null) {
      lines.push(`Shipping: ${formatDollars(args.shippingFeeCents)}`);
    }
    if (args.taxAmountCents != null) {
      lines.push(`Sales Tax (7%): ${formatDollars(args.taxAmountCents)}`);
    }
    lines.push(`Total: ${formatDollars(args.amountTotalCents)}`);
  } else {
    lines.push(`Product: ${args.productName}`);
    lines.push(`Total: ${formatDollars(args.amountTotalCents)}`);
  }

  if (args.billingAddress) {
    const a = args.billingAddress;
    lines.push(``, `Billing:`);
    lines.push(`  ${a.street}`);
    if (a.apt) lines.push(`  ${a.apt}`);
    lines.push(`  ${a.city}, ${a.state} ${a.zip}`);
    lines.push(`  ${a.country}`);
  }

  if (args.shippingAddress) {
    const a = args.shippingAddress;
    lines.push(``, `Shipping:`);
    lines.push(`  ${a.street}`);
    if (a.apt) lines.push(`  ${a.apt}`);
    lines.push(`  ${a.city}, ${a.state} ${a.zip}`);
    lines.push(`  ${a.country}`);
  }

  if (args.orderNotes) {
    lines.push(``, `Order Notes:`);
    lines.push(`  ${args.orderNotes}`);
  }

  lines.push(``, `---`, `This is an automated notification from the FestiveMotion storefront.`);
  return lines.join("\n");
}

function buildAdminHtml(args: SendOrderEmailArgs): string {
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Order meta cards
  let metaCards = `
      <div style="flex:1;padding:12px 16px;background:#111;border-radius:8px">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Order ID</p>
        <p style="margin:4px 0 0;font-size:14px;color:#fff;font-weight:600">${args.orderId.slice(0, 8)}</p>
      </div>
      <div style="flex:1;padding:12px 16px;background:#111;border-radius:8px">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Date</p>
        <p style="margin:4px 0 0;font-size:14px;color:#fff;font-weight:600">${orderDate}</p>
      </div>`;

  if (args.stripePaymentIntentId) {
    metaCards += `
      <div style="flex:1;padding:12px 16px;background:#111;border-radius:8px">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Payment ID</p>
        <p style="margin:4px 0 0;font-size:14px;color:#fff;font-weight:600">${escapeHtml(args.stripePaymentIntentId.slice(0, 12))}</p>
      </div>`;
  }

  // Customer section
  const customerBlock = `
    <div style="margin-bottom:24px;padding:16px;background:#111;border-radius:8px">
      <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Customer</p>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:4px 0;color:#888;font-size:13px;width:60px">Name</td>
          <td style="padding:4px 0;color:#fff;font-size:14px">${escapeHtml(args.customerName ?? "N/A")}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#888;font-size:13px">Email</td>
          <td style="padding:4px 0;color:#fff;font-size:14px">${args.customerEmail ? `<a href="mailto:${escapeHtml(args.customerEmail)}" style="color:#ff5a1f;text-decoration:none">${escapeHtml(args.customerEmail)}</a>` : "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#888;font-size:13px">Phone</td>
          <td style="padding:4px 0;color:#fff;font-size:14px">${escapeHtml(args.customerPhone ?? "N/A")}</td>
        </tr>
      </table>
    </div>`;

  // Items table
  const items = args.items ?? [];
  let subtotalCents = 0;
  const itemRows = items
    .map((item) => {
      subtotalCents += item.totalCents;
      return `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#ccc;font-size:14px">${escapeHtml(item.label)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#ccc;font-size:14px;text-align:center">${escapeHtml(String(item.quantity))}</td>
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#fff;font-size:14px;text-align:right;font-weight:600">${formatDollars(item.totalCents)}</td>
        </tr>`;
    })
    .join("");

  // Pricing footer rows
  let pricingRows = `
        <tr>
          <td colspan="2" style="padding:8px 0 0;color:#aaa;font-size:14px">Subtotal</td>
          <td style="padding:8px 0 0;color:#ccc;font-size:14px;text-align:right">${formatDollars(subtotalCents)}</td>
        </tr>`;

  if (args.promoCode && args.discountAmountCents) {
    pricingRows += `
        <tr>
          <td colspan="2" style="padding:4px 0 0;color:#aaa;font-size:14px">Promo: <span style="color:#ff5a1f">${escapeHtml(args.promoCode)}</span></td>
          <td style="padding:4px 0 0;color:#4ade80;font-size:14px;text-align:right">-${formatDollars(args.discountAmountCents)}</td>
        </tr>`;
  }

  if (args.shippingFeeCents != null) {
    pricingRows += `
        <tr>
          <td colspan="2" style="padding:4px 0 0;color:#aaa;font-size:14px">Shipping</td>
          <td style="padding:4px 0 0;color:#ccc;font-size:14px;text-align:right">${formatDollars(args.shippingFeeCents)}</td>
        </tr>`;
  }

  if (args.taxAmountCents != null) {
    pricingRows += `
        <tr>
          <td colspan="2" style="padding:4px 0 0;color:#aaa;font-size:14px">Sales Tax (7%)</td>
          <td style="padding:4px 0 0;color:#ccc;font-size:14px;text-align:right">${formatDollars(args.taxAmountCents)}</td>
        </tr>`;
  }

  pricingRows += `
        <tr>
          <td colspan="2" style="padding:12px 0 0;color:#fff;font-size:16px;font-weight:700">Total</td>
          <td style="padding:12px 0 0;color:#ff5a1f;font-size:16px;font-weight:700;text-align:right">${formatDollars(args.amountTotalCents)}</td>
        </tr>`;

  const itemsTable = items.length > 0
    ? `<table style="width:100%;border-collapse:collapse">
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
        ${pricingRows}
      </tfoot>
    </table>`
    : `<p style="color:#ccc;font-size:14px">Product: ${escapeHtml(args.productName)}</p>
       <p style="color:#ff5a1f;font-size:16px;font-weight:700">Total: ${formatDollars(args.amountTotalCents)}</p>`;

  // Address blocks
  const billingBlock = args.billingAddress
    ? `<div style="margin-top:24px;padding:16px;background:#111;border-radius:8px">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Billing Address</p>
        <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6">
          ${escapeHtml(args.billingAddress.street)}${args.billingAddress.apt ? `<br>${escapeHtml(args.billingAddress.apt)}` : ""}<br>
          ${escapeHtml(args.billingAddress.city)}, ${escapeHtml(args.billingAddress.state)} ${escapeHtml(args.billingAddress.zip)}<br>
          ${escapeHtml(args.billingAddress.country)}
        </p>
      </div>`
    : "";

  const shippingBlock = args.shippingAddress
    ? `<div style="margin-top:24px;padding:16px;background:#111;border-radius:8px">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Shipping Address</p>
        <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6">
          ${escapeHtml(args.shippingAddress.street)}${args.shippingAddress.apt ? `<br>${escapeHtml(args.shippingAddress.apt)}` : ""}<br>
          ${escapeHtml(args.shippingAddress.city)}, ${escapeHtml(args.shippingAddress.state)} ${escapeHtml(args.shippingAddress.zip)}<br>
          ${escapeHtml(args.shippingAddress.country)}
        </p>
      </div>`
    : "";

  const notesBlock = args.orderNotes
    ? `<div style="margin-top:24px;padding:16px;background:#111;border-radius:8px">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Order Notes</p>
        <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6">${escapeHtml(args.orderNotes)}</p>
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
      <p style="margin:8px 0 0;font-size:13px;color:#888">New Order</p>
    </div>

    <!-- Order meta -->
    <div style="display:flex;gap:16px;margin:24px 0">
      ${metaCards}
    </div>

    <!-- Customer -->
    ${customerBlock}

    <!-- Items table -->
    ${itemsTable}

    ${billingBlock}
    ${shippingBlock}
    ${notesBlock}

    <!-- Footer -->
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #222;text-align:center">
      <p style="margin:0;font-size:12px;color:#555">This is an automated notification from the FestiveMotion storefront.</p>
    </div>
  </div>
</body>
</html>`;
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
      from: "FestiveMotion <orders@smallhr.app>",
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
  billingAddress?: ShippingAddress | null;
  orderNotes?: string | null;
  items: OrderEmailItem[];
  promoCode?: string | null;
  discountAmountCents?: number | null;
  subtotalCents?: number | null;
  shippingFeeCents?: number | null;
  taxAmountCents?: number | null;
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

  if (args.subtotalCents != null) {
    lines.push(`Subtotal: ${formatDollars(args.subtotalCents)}`);
  }
  if (args.promoCode && args.discountAmountCents) {
    lines.push(`Promo: ${args.promoCode} — -${formatDollars(args.discountAmountCents)}`);
  }
  if (args.shippingFeeCents != null) {
    lines.push(`Shipping: ${formatDollars(args.shippingFeeCents)}`);
  }
  if (args.taxAmountCents != null) {
    lines.push(`Sales Tax (7%): ${formatDollars(args.taxAmountCents)}`);
  }
  lines.push(`Total: ${formatDollars(args.amountTotalCents)}`);

  if (args.billingAddress) {
    const a = args.billingAddress;
    lines.push(``, `Billing:`);
    lines.push(`  ${a.street}`);
    if (a.apt) lines.push(`  ${a.apt}`);
    lines.push(`  ${a.city}, ${a.state} ${a.zip}`);
    lines.push(`  ${a.country}`);
  }

  if (args.shippingAddress) {
    const a = args.shippingAddress;
    lines.push(``, `Shipping to:`);
    lines.push(`  ${a.street}`);
    if (a.apt) lines.push(`  ${a.apt}`);
    lines.push(`  ${a.city}, ${a.state} ${a.zip}`);
    lines.push(`  ${a.country}`);
  }

  if (args.orderNotes) {
    lines.push(``, `Order Notes:`);
    lines.push(`  ${args.orderNotes}`);
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
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#ccc;font-size:14px">${escapeHtml(item.label)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#ccc;font-size:14px;text-align:center">${escapeHtml(String(item.quantity))}</td>
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#fff;font-size:14px;text-align:right;font-weight:600">${formatDollars(item.totalCents)}</td>
        </tr>`,
    )
    .join("");

  const shippingBlock = args.shippingAddress
    ? `<div style="margin-top:24px;padding:16px;background:#111;border-radius:8px">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Shipping Address</p>
        <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6">
          ${escapeHtml(args.shippingAddress.street)}${args.shippingAddress.apt ? `<br>${escapeHtml(args.shippingAddress.apt)}` : ""}<br>
          ${escapeHtml(args.shippingAddress.city)}, ${escapeHtml(args.shippingAddress.state)} ${escapeHtml(args.shippingAddress.zip)}<br>
          ${escapeHtml(args.shippingAddress.country)}
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
      <p style="margin:0;font-size:16px;color:#fff">${args.customerName ? `Hi ${escapeHtml(args.customerName)},` : "Hi there,"}</p>
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
        ${args.subtotalCents != null ? `<tr>
          <td colspan="2" style="padding:8px 0 0;color:#aaa;font-size:14px">Subtotal</td>
          <td style="padding:8px 0 0;color:#ccc;font-size:14px;text-align:right">${formatDollars(args.subtotalCents)}</td>
        </tr>` : ""}
        ${args.promoCode && args.discountAmountCents ? `<tr>
          <td colspan="2" style="padding:4px 0 0;color:#aaa;font-size:14px">Promo: <span style="color:#ff5a1f">${escapeHtml(args.promoCode)}</span></td>
          <td style="padding:4px 0 0;color:#4ade80;font-size:14px;text-align:right">-${formatDollars(args.discountAmountCents)}</td>
        </tr>` : ""}
        ${args.shippingFeeCents != null ? `<tr>
          <td colspan="2" style="padding:4px 0 0;color:#aaa;font-size:14px">Shipping</td>
          <td style="padding:4px 0 0;color:#ccc;font-size:14px;text-align:right">${formatDollars(args.shippingFeeCents)}</td>
        </tr>` : ""}
        ${args.taxAmountCents != null ? `<tr>
          <td colspan="2" style="padding:4px 0 0;color:#aaa;font-size:14px">Sales Tax (7%)</td>
          <td style="padding:4px 0 0;color:#ccc;font-size:14px;text-align:right">${formatDollars(args.taxAmountCents)}</td>
        </tr>` : ""}
        <tr>
          <td colspan="2" style="padding:12px 0 0;color:#fff;font-size:16px;font-weight:700">Total</td>
          <td style="padding:12px 0 0;color:#ff5a1f;font-size:16px;font-weight:700;text-align:right">${formatDollars(args.amountTotalCents)}</td>
        </tr>
      </tfoot>
    </table>

    ${args.billingAddress ? `<div style="margin-top:24px;padding:16px;background:#111;border-radius:8px">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Billing Address</p>
        <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6">
          ${escapeHtml(args.billingAddress.street)}${args.billingAddress.apt ? `<br>${escapeHtml(args.billingAddress.apt)}` : ""}<br>
          ${escapeHtml(args.billingAddress.city)}, ${escapeHtml(args.billingAddress.state)} ${escapeHtml(args.billingAddress.zip)}<br>
          ${escapeHtml(args.billingAddress.country)}
        </p>
      </div>` : ""}
    ${shippingBlock}
    ${args.orderNotes ? `<div style="margin-top:24px;padding:16px;background:#111;border-radius:8px">
        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#888">Order Notes</p>
        <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6">${escapeHtml(args.orderNotes)}</p>
      </div>` : ""}

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
      from: "FestiveMotion <orders@smallhr.app>",
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
      from: "FestiveMotion <orders@smallhr.app>",
      to: notifyEmail,
      subject: `New Order ${args.orderId.slice(0, 8)} — ${formatDollars(args.amountTotalCents)} — ${args.customerName || "Guest"}`,
      html: buildAdminHtml(args),
      text: buildAdminPlainText(args),
    });
  } catch (error) {
    console.error("Failed to send order email via Resend:", error);
  }
}
