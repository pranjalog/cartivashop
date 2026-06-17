"use client";

import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
            Your Bag
          </h1>
          <p className="text-gray-500 mt-2">
            {items.length} item{items.length !== 1 && "s"}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-24"
          >
            <ShoppingBag size={64} className="text-gray-200 mx-auto mb-6" />
            <p className="text-xl font-semibold text-gray-400">
              Your bag is empty
            </p>
            <p className="text-gray-400 mt-2">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Start Shopping
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="mt-10">
            {/* Items */}
            <div className="space-y-6">
              {items.map((item, i) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 py-6 border-b border-gray-100"
                >
                  <div className="w-28 h-28 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.product.id}`}
                          className="text-sm font-semibold hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        {item.selectedColor && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Color: {item.selectedColor}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-bold whitespace-nowrap">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="p-2 hover:bg-gray-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="p-2 hover:bg-gray-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-10 bg-gray-50 rounded-2xl p-8">
              <h2 className="text-lg font-bold uppercase tracking-wider mb-6">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {totalPrice >= 500 ? "Free" : "₹49"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Loyalty Points Earned
                  </span>
                  <span className="font-semibold text-purple-600">
                    +{Math.floor(totalPrice / 10)} pts
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mt-6 pt-6 border-t border-gray-200">
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Total
                </span>
                <span className="text-2xl font-black">
                  ₹{(totalPrice < 500 ? totalPrice + 49 : totalPrice).toLocaleString("en-IN")}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full mt-6 py-4 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors text-center"
              >
                Proceed to Checkout
              </Link>

              <div className="flex items-center justify-between mt-4">
                <Link
                  href="/products"
                  className="text-sm text-gray-500 hover:text-black underline transition-colors"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
