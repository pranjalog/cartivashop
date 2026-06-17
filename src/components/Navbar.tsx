"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Menu, X, Search, BarChart3 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/loyalty", label: "Rewards" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { items: compareItems } = useCompare();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      {/* Promo Bar */}
      <div className="bg-black text-white text-center text-xs tracking-widest uppercase py-2 px-4">
        Free shipping on orders over ₹500 &bull; Join Cartiva Rewards for 2× points
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-black tracking-tight uppercase">
              Cartiva
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-black transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>

            <Link
              href="/compare"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="Compare products"
            >
              <BarChart3 size={20} />
              {compareItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareItems.length}
                </span>
              )}
            </Link>

            <Link
              href="/wishlist"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-medium uppercase tracking-wider text-gray-800 hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
