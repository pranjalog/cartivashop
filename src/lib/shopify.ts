const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-10";

export interface ShopifyLineItem {
  title: string;
  price: number;
  quantity: number;
  variantTitle?: string;
}

export interface ShopifyShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateShopifyOrderInput {
  email: string;
  lineItems: ShopifyLineItem[];
  shipping: ShopifyShippingAddress;
  shippingPrice: number;
  currency?: string;
  note?: string;
}

export interface ShopifyOrderResult {
  id: number;
  name: string;
  orderStatusUrl: string | null;
}

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { first: parts[0], last: "" };
  }
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export function isShopifyConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_API_TOKEN
  );
}

export async function createShopifyOrder(
  input: CreateShopifyOrderInput
): Promise<ShopifyOrderResult> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN;

  if (!domain || !token) {
    throw new Error("Shopify is not configured");
  }

  const { first, last } = splitName(input.shipping.name);

  const payload = {
    order: {
      email: input.email,
      currency: input.currency || "INR",
      financial_status: "paid",
      send_receipt: true,
      send_fulfillment_receipt: false,
      note: input.note,
      line_items: input.lineItems.map((item) => ({
        title: item.title,
        price: item.price.toFixed(2),
        quantity: item.quantity,
        variant_title: item.variantTitle,
        requires_shipping: true,
      })),
      shipping_lines:
        input.shippingPrice > 0
          ? [
              {
                title: "Standard Shipping",
                price: input.shippingPrice.toFixed(2),
                code: "standard",
              },
            ]
          : [],
      customer: {
        first_name: first,
        last_name: last,
        email: input.email,
        phone: input.shipping.phone,
      },
      shipping_address: {
        first_name: first,
        last_name: last,
        address1: input.shipping.address,
        city: input.shipping.city,
        province: input.shipping.state,
        zip: input.shipping.pincode,
        phone: input.shipping.phone,
        country: "India",
      },
    },
  };

  const response = await fetch(
    `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/orders.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Shopify order creation failed (${response.status}): ${text}`
    );
  }

  const data = await response.json();
  const order = data.order;

  return {
    id: order.id,
    name: order.name,
    orderStatusUrl: order.order_status_url ?? null,
  };
}
