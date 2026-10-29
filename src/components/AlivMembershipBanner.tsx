import React, { useState, useEffect } from "react";
import { Sparkles, Crown, ArrowRight } from "lucide-react";
import { ALIV_ECOSYSTEM_PLANS, getAlivUpgradeUrl } from "../utils/alivEcosystem";

export const AlivMembershipBanner: React.FC = () => {
  const [tier, setTier] = useState<string>("free");

  useEffect(() => {
    const cached = localStorage.getItem("aliv_user_pass") || "free";
    setTier(cached);
  }, []);

  const isPaid = tier !== "free";
  const currentPlan = ALIV_ECOSYSTEM_PLANS.find(p => p.code === tier) || ALIV_ECOSYSTEM_PLANS[0];

  return (
    <div className="w-full rounded-2xl bg-emerald-950/40 border border-emerald-600/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
          {isPaid ? (
            <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          ) : (
            <Sparkles className="w-5 h-5 text-emerald-400" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white">
              {isPaid ? `${currentPlan.name} Member` : "Free Tier"}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              Aliv Ecosystem Pass
            </span>
          </div>
          <p className="text-xs text-stone-300 mt-0.5">
            {isPaid
              ? "Your pass unlocks premium features across all 11 Aliv apps."
              : "Upgrade on AlivOne to get AlivPro (₹249/mo) or AlivUltra (₹599/mo) across all apps."}
          </p>
        </div>
      </div>

      <button
        onClick={() => window.open(getAlivUpgradeUrl("pro", "Alivane"), "_blank")}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-stone-950 hover:bg-emerald-400 transition-colors shrink-0"
      >
        {isPaid ? "Manage Pass on AlivOne" : "Upgrade on AlivOne"}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
