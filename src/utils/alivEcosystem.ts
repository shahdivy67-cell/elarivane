/**
 * Alivane - Aliv Ecosystem Integration Module
 * Lightweight browser-native sync using BroadcastChannel, localStorage, and AlivOne central auth
 */

export type AlivPlanCode = "free" | "pro" | "ultra" | "pro_lft" | "ultra_lft";

export interface AlivPlan {
  code: AlivPlanCode;
  name: string;
  price: number;
  priceDisplay: string;
  period: string;
  tagline: string;
  badge?: string;
  features: string[];
}

export const ALIV_ECOSYSTEM_PLANS: AlivPlan[] = [
  {
    code: "free",
    name: "Free",
    price: 0,
    priceDisplay: "₹0",
    period: "forever",
    tagline: "Essential access across basic Aliv apps",
    features: [
      "Access to all core apps",
      "Standard features",
      "Mindful activities & presence prompts"
    ],
  },
  {
    code: "pro",
    name: "AlivPro",
    price: 249,
    priceDisplay: "₹249",
    period: "per month",
    badge: "Most Popular",
    tagline: "Full Pro intelligence unlocked across all 11 Aliv apps",
    features: [
      "Unified Pro access across all 11 Aliv apps",
      "Unlimited creative prompts & deep activities",
      "Multi-device cloud synchronization",
      "Priority processing queue"
    ],
  },
  {
    code: "ultra",
    name: "AlivUltra",
    price: 599,
    priceDisplay: "₹599",
    period: "per month",
    badge: "Power Creators",
    tagline: "Maximum unrestricted power across the entire ecosystem",
    features: [
      "Unified Ultra access across all 11 Aliv apps",
      "Deepest AI reasoning across all apps",
      "First-day access to every upcoming Aliv app launch"
    ],
  },
  {
    code: "pro_lft",
    name: "AlivPro-LFT",
    price: 2490,
    priceDisplay: "₹2,490",
    period: "one-time lifetime grant",
    badge: "Best Value",
    tagline: "Pay once (₹2,490), enjoy AlivPro for life with zero renewals",
    features: [
      "Permanent AlivPro grant for life",
      "All 11 current apps permanently unlocked in Pro",
      "No recurring renewals"
    ],
  },
  {
    code: "ultra_lft",
    name: "AlivUltra-LFT",
    price: 5990,
    priceDisplay: "₹5990",
    period: "one-time lifetime grant",
    badge: "Ultimate Lifetime",
    tagline: "The definitive lifetime pass to everything Aliv builds (₹5,990)",
    features: [
      "Permanent AlivUltra grant for life",
      "All current & future Aliv apps unlocked in Ultra forever",
      "Founder hotline & VIP direct access"
    ],
  },
];

export const ALIVONE_PORTAL_URL = "https://alivone.vercel.app";

export function getAlivUpgradeUrl(planCode: AlivPlanCode = "pro", sourceApp: string = "Alivane"): string {
  const params = new URLSearchParams();
  if (planCode) params.set("plan", planCode);
  if (sourceApp) params.set("source", sourceApp);
  return `${ALIVONE_PORTAL_URL}/keys?${params.toString()}`;
}

export function getAlivSignInUrl(sourceApp: string = "Alivane"): string {
  return `${ALIVONE_PORTAL_URL}/auth?source=${encodeURIComponent(sourceApp)}&returnTo=${encodeURIComponent(window.location.href)}`;
}
