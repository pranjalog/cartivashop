"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
            Wishlist
          </h1>
          <p className="text-gray-500 mt-2">
            {items.length} saved item{items.length !== 1 && "s"}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-24"
          >
            <Heart size={64} className="text-gray-200 mx-auto mb-6" />
            <p className="text-xl font-semibold text-gray-400">
              Your wishlist is empty
            </p>
            <p className="text-gray-400 mt-2">
              Save items you love by clicking the heart icon.
            </p>
            <Link
              href="/products"
              className="inline-block mt-8 px-8 py-4 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Explore Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
