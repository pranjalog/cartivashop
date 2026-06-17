"use client";

import { motion } from "framer-motion";
import { BarChart3, X, ShoppingBag, Star } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ComparePage() {
  const { items, removeItem, clearAll } = useCompare();
  const { addItem } = useCart();

  const allSpecs = Array.from(
    new Set(items.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
              Compare
            </h1>
            <p className="text-gray-500 mt-2">
              {items.length} product{items.length !== 1 && "s"} (max 4)
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          )}
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-24"
          >
            <BarChart3 size={64} className="text-gray-200 mx-auto mb-6" />
            <p className="text-xl font-semibold text-gray-400">
              No products to compare
            </p>
            <p className="text-gray-400 mt-2">
              Add products to compare by clicking the compare icon on any
              product card.
            </p>
            <Link
              href="/products"
              className="inline-block mt-8 px-8 py-4 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-4 w-40" />
                  {items.map((product) => (
                    <th
                      key={product.id}
                      className="p-4 text-left align-top"
                    >
                      <div className="relative">
                        <button
                          onClick={() => removeItem(product.id)}
                          className="absolute -top-2 -right-2 p-1 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                          aria-label="Remove from compare"
                        >
                          <X size={14} />
                        </button>

                        <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                          <ShoppingBag
                            size={32}
                            className="text-gray-300"
                          />
                        </div>

                        <Link
                          href={`/products/${product.id}`}
                          className="text-sm font-semibold hover:underline block"
                        >
                          {product.name}
                        </Link>

                        <div className="flex items-center gap-1 mt-1">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span className="text-xs text-gray-500">
                            {product.rating}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-lg font-bold">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => addItem(product)}
                          className="w-full mt-3 py-2 bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Category */}
                <tr className="border-t border-gray-100">
                  <td className="p-4 text-sm font-medium text-gray-500">
                    Category
                  </td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-sm">
                      {p.category}
                    </td>
                  ))}
                </tr>

                {/* Specs */}
                {allSpecs.map((spec) => (
                  <tr key={spec} className="border-t border-gray-100">
                    <td className="p-4 text-sm font-medium text-gray-500">
                      {spec}
                    </td>
                    {items.map((p) => (
                      <td key={p.id} className="p-4 text-sm">
                        {p.specs?.[spec] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
