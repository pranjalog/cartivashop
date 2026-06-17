import crypto from "crypto";

export const SHOPIFY_OAUTH_SCOPES =
  process.env.SHOPIFY_SCOPES || "write_orders,read_orders";

function getAppUrl(request: Request): string {
  if (process.env.SHOPIFY_APP_URL) {
    return process.env.SHOPIFY_APP_URL.replace(/\/$/, "");
  }
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export function getRedirectUri(request: Request): string {
  return `${getAppUrl(request)}/api/shopify/callback`;
}

export function isValidShopDomain(shop: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop);
}

export function buildInstallUrl(
  shop: string,
  redirectUri: string,
  state: string
): string {
  const apiKey = process.env.SHOPIFY_API_KEY;
  if (!apiKey) {
    throw new Error("SHOPIFY_API_KEY is not configured");
  }
  const params = new URLSearchParams({
    client_id: apiKey,
    scope: SHOPIFY_OAUTH_SCOPES,
    redirect_uri: redirectUri,
    state,
  });
  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}

/**
 * Verifies the HMAC signature Shopify appends to OAuth callback query params.
 */
export function verifyOAuthHmac(searchParams: URLSearchParams): boolean {
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    throw new Error("SHOPIFY_API_SECRET is not configured");
  }

  const hmac = searchParams.get("hmac");
  if (!hmac) return false;

  const message = Array.from(searchParams.entries())
    .filter(([key]) => key !== "hmac" && key !== "signature")
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("&");

  const digest = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, "utf-8"),
      Buffer.from(hmac, "utf-8")
    );
  } catch {
    return false;
  }
}

export interface AccessTokenResult {
  accessToken: string;
  scope: string;
}

export async function exchangeCodeForToken(
  shop: string,
  code: string
): Promise<AccessTokenResult> {
  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecret = process.env.SHOPIFY_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error("Shopify OAuth credentials are not configured");
  }

  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return { accessToken: data.access_token, scope: data.scope };
}
