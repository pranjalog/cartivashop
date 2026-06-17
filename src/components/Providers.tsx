"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <CompareProvider>{children}</CompareProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
