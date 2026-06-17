"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");
  const shopifyOrder = searchParams.get("shopifyOrder");

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-8"
        >
          <CheckCircle size={48} className="text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 mt-4 text-lg">
            Thank you for shopping with Cartiva. Your order has been placed
            successfully.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 bg-gray-50 rounded-2xl p-8 text-left"
        >
          <div className="flex items-center gap-3 mb-6">
            <Package size={24} className="text-gray-700" />
            <h2 className="text-lg font-bold uppercase tracking-wider">
              Order Details
            </h2>
          </div>

          <div className="space-y-3">
            {shopifyOrder && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order Number</span>
                <span className="font-mono font-semibold text-xs">
                  {shopifyOrder}
                </span>
              </div>
            )}
            {orderId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-semibold text-xs">
                  {orderId}
                </span>
              </div>
            )}
            {paymentId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment ID</span>
                <span className="font-mono font-semibold text-xs">
                  {paymentId}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="font-semibold text-green-600">Paid</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              You will receive an order confirmation email shortly. We&apos;ll
              notify you when your order ships.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-black text-black text-sm font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-28 pb-24 text-center">
          <p className="text-gray-400">Loading order details...</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
