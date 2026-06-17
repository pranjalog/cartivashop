"use client";

import { motion } from "framer-motion";
import { loyaltyTiers } from "@/data/products";
import { Gift, Star, Zap, Trophy, Check } from "lucide-react";
import Link from "next/link";

const icons = [Gift, Star, Zap, Trophy];

export default function LoyaltyPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-6">
            Cartiva Rewards
          </span>
          <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95]">
            Get rewarded
            <br />
            for{" "}
            <span className="bg-gradient-to-r from-purple-500 to-rose-500 bg-clip-text text-transparent">
              self care
            </span>
          </h1>
          <p className="text-gray-500 mt-6 text-lg max-w-lg mx-auto leading-relaxed">
            Earn points with every purchase, unlock exclusive perks, and level
            up your wellness journey. It&apos;s free to join.
          </p>
          <button className="mt-8 px-8 py-4 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Join for Free
          </button>
        </motion.div>

        {/* How it works */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black uppercase tracking-tight text-center mb-12"
          >
            How It Works
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up Free",
                desc: "Create your Cartiva Rewards account in seconds. No purchase required.",
              },
              {
                step: "02",
                title: "Earn Points",
                desc: "Get points for every rupee you spend, plus bonus points for reviews, referrals & birthdays.",
              },
              {
                step: "03",
                title: "Unlock Rewards",
                desc: "Redeem points for discounts, free products, and exclusive VIP perks as you level up.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <span className="text-6xl font-black text-gray-100">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold mt-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tiers */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black uppercase tracking-tight text-center mb-12"
          >
            Reward Tiers
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loyaltyTiers.map((tier, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl p-6 border ${
                    i === 3
                      ? "bg-black text-white border-black"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Icon
                    size={28}
                    className={i === 3 ? "text-purple-400" : "text-gray-400"}
                  />
                  <h3 className="text-xl font-bold mt-4">{tier.name}</h3>
                  <p
                    className={`text-xs mt-1 ${
                      i === 3 ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {tier.minPoints === 0
                      ? "Join to start"
                      : `${tier.minPoints.toLocaleString()} points`}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <Check
                          size={14}
                          className={`mt-0.5 flex-shrink-0 ${
                            i === 3 ? "text-purple-400" : "text-green-500"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            i === 3 ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {perk}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Ways to Earn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-8 sm:p-12"
        >
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8">
            Ways to Earn Points
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                action: "Make a Purchase",
                points: "1 pt per ₹10",
                desc: "Earn on every order automatically",
              },
              {
                action: "Write a Review",
                points: "+25 pts",
                desc: "Share your honest experience",
              },
              {
                action: "Refer a Friend",
                points: "+100 pts",
                desc: "Both you and your friend earn",
              },
              {
                action: "Birthday Bonus",
                points: "Up to +500 pts",
                desc: "Depends on your tier level",
              },
              {
                action: "Follow on Social",
                points: "+10 pts each",
                desc: "Instagram, Twitter, Facebook",
              },
              {
                action: "Complete Your Profile",
                points: "+50 pts",
                desc: "One-time bonus for full profile",
              },
            ].map((item) => (
              <div
                key={item.action}
                className="flex items-start gap-4 bg-white rounded-xl p-5"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">
                    {item.points.split(" ")[0]}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{item.action}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  <p className="text-xs font-bold text-purple-600 mt-1">
                    {item.points}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Ready to Start Earning?
          </h2>
          <p className="text-gray-500 mt-2">
            Join Cartiva Rewards today — it&apos;s completely free.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button className="px-8 py-4 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors">
              Create Account
            </button>
            <Link
              href="/products"
              className="px-8 py-4 border-2 border-black text-black text-sm font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              Start Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
