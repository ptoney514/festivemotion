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
