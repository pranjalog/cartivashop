"use client";

import { Suspense, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const result =
      activeCategory === "All"
        ? [...products]
        : products.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    return result;
  }, [activeCategory, sortBy]);

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
          All Products
        </h1>
        <p className="text-gray-500 mt-2">
          {filtered.length} product{filtered.length !== 1 && "s"}
        </p>
      </motion.div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
                activeCategory === cat
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & filter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold uppercase tracking-wider bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg">
            No products in this category yet.
          </p>
        </div>
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="text-center py-24">
              <p className="text-gray-400">Loading products...</p>
            </div>
          }
        >
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  );
}
