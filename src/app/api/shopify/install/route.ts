import crypto from "crypto";
import { NextResponse } from "next/server";
import {
  buildInstallUrl,
  getRedirectUri,
  isValidShopDomain,
} from "@/lib/shopify-oauth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shop =
    url.searchParams.get("shop") || process.env.SHOPIFY_STORE_DOMAIN || "";

  if (!shop || !isValidShopDomain(shop)) {
    return NextResponse.json(
      { error: "Missing or invalid 'shop' parameter (expected *.myshopify.com)" },
      { status: 400 }
    );
  }

  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = getRedirectUri(request);

  let installUrl: string;
  try {
    installUrl = buildInstallUrl(shop, redirectUri, state);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to build install URL";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const response = NextResponse.redirect(installUrl);
  response.cookies.set("shopify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return response;
}
