import { NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  isValidShopDomain,
  verifyOAuthHmac,
} from "@/lib/shopify-oauth";

function htmlPage(title: string, body: string, status: number) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>body{font-family:system-ui,sans-serif;max-width:640px;margin:60px auto;padding:0 20px;line-height:1.6}
    code{background:#f4f4f5;padding:2px 6px;border-radius:4px;word-break:break-all}
    .token{display:block;background:#111;color:#fff;padding:16px;border-radius:8px;margin:16px 0;word-break:break-all}
    .err{color:#b91c1c}</style></head><body>${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const shop = params.get("shop") || "";
  const code = params.get("code") || "";
  const state = params.get("state") || "";

  if (!shop || !isValidShopDomain(shop) || !code) {
    return htmlPage(
      "Shopify install failed",
      `<h1 class="err">Install failed</h1><p>Missing shop or code parameter.</p>`,
      400
    );
  }

  const expectedState = request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("shopify_oauth_state="))
    ?.split("=")[1];

  if (!expectedState || expectedState !== state) {
    return htmlPage(
      "Shopify install failed",
      `<h1 class="err">Install failed</h1><p>Invalid OAuth state. Please start the install again from <code>/api/shopify/install</code>.</p>`,
      403
    );
  }

  if (!verifyOAuthHmac(params)) {
    return htmlPage(
      "Shopify install failed",
      `<h1 class="err">Install failed</h1><p>HMAC validation failed.</p>`,
      403
    );
  }

  try {
    const { accessToken, scope } = await exchangeCodeForToken(shop, code);
    return htmlPage(
      "Shopify connected",
      `<h1>Shopify connected</h1>
       <p>Store: <code>${shop}</code><br/>Granted scopes: <code>${scope}</code></p>
       <p>Add these to your environment (e.g. Vercel project settings), then redeploy:</p>
       <p><strong>SHOPIFY_STORE_DOMAIN</strong></p>
       <span class="token">${shop}</span>
       <p><strong>SHOPIFY_ADMIN_API_TOKEN</strong> (shown once \u2014 copy it now)</p>
       <span class="token">${accessToken}</span>
       <p>Once set, paid orders will be created in your Shopify store automatically.</p>`,
      200
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Token exchange failed";
    return htmlPage(
      "Shopify install failed",
      `<h1 class="err">Install failed</h1><p>${message}</p>`,
      500
    );
  }
}
