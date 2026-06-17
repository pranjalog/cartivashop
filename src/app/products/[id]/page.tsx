"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  BarChart3,
  ShoppingBag,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);

  const { addItem } = useCart();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlist();
  const { isInCompare, toggleItem: toggleCompare } = useCompare();

  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  if (!product) {
    notFound();
  }

  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-black transition-colors">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 truncate">{product.name}</span>
        </nav>

        {/* Product */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <ShoppingBag size={80} className="text-gray-300" />
              {product.originalPrice && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded">
                  {discount}% Off
                </span>
              )}
            </div>

            {/* Thumbnail row */}
            <div className="flex gap-3 mt-4">
              {product.images.map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-black transition-all"
                >
                  <ShoppingBag size={20} className="text-gray-300" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.tags.includes("bestseller") && (
                <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded">
                  Bestseller
                </span>
              )}
              {product.originalPrice && (
                <span className="px-2.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded">
                  {discount}% Off
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-6">
              <span className="text-4xl font-black">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p className="text-gray-600 mt-4 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Color selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold mb-3">
                  Color: <span className="font-normal text-gray-500">{selectedColor}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs font-medium border rounded-full transition-all ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to bag */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border border-gray-200 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-5 text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => addItem(product, quantity, selectedColor)}
                className="flex-1 py-4 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Add to Bag — ₹{(product.price * quantity).toLocaleString("en-IN")}
              </button>
            </div>

            {/* Wishlist & Compare */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  wishlisted
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                <Heart
                  size={14}
                  fill={wishlisted ? "currentColor" : "none"}
                />
                {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
              <button
                onClick={() => toggleCompare(product)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  compared
                    ? "border-black bg-black text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                <BarChart3 size={14} />
                {compared ? "In Compare" : "Compare"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-gray-400" />
                <span className="text-xs text-gray-500">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={18} className="text-gray-400" />
                <span className="text-xs text-gray-500">7 Day Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex border-b border-gray-200">
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold uppercase tracking-wider transition-colors relative ${
                  activeTab === tab
                    ? "text-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "specs" ? "Specifications" : tab === "reviews" ? `Reviews (${product.reviewCount.toLocaleString()})` : tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 leading-relaxed max-w-3xl"
              >
                {product.description}
              </motion.p>
            )}

            {activeTab === "specs" && product.specs && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-2xl"
              >
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm font-medium text-gray-500">
                      {key}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {value}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-400">
                  Reviews coming soon. Rated {product.rating}/5 by{" "}
                  {product.reviewCount.toLocaleString()} customers.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
