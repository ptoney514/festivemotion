import "server-only";

type SendOrderEmailArgs = {
  amountTotalCents: number;
  customerEmail: string | null;
  orderId: string;
  productName: string;
};

export async function sendOrderEmail(args: SendOrderEmailArgs) {
  console.info("sendOrderEmail stub", args);
}
