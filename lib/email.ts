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
