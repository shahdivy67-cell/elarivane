import React, { useState, useEffect } from "react";
import { User, Check, Trash2, Plus, Sparkles, Shield, ArrowRight } from "lucide-react";
import {
  getSavedAlivAccounts,
  removeAlivAccount,
  switchAlivAccount,
  AlivSavedAccount,
  emailToUserId,
  ALIVONE_PORTAL_URL,
} from "@/lib/alivEcosystem";
import { supabase } from "@/integrations/supabase/client";

interface AlivAccountSwitcherProps {
  onAddAccount?: () => void;
  className?: string;
}

export const AlivAccountSwitcher: React.FC<AlivAccountSwitcherProps> = ({
  onAddAccount,
  className = "",
}) => {
  const [accounts, setAccounts] = useState<AlivSavedAccount[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("shahdivy67");
  const [switching, setSwitching] = useState<string | null>(null);

  const loadAccounts = () => {
    const list = getSavedAlivAccounts();
    setAccounts(list);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setCurrentUserId(emailToUserId(session.user.email));
      }
    });
  };

  useEffect(() => {
    loadAccounts();

    // Listen for broadcast sync from AlivOne or other apps
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel("aliv_accounts_sync");
      bc.onmessage = (e) => {
        if (e.data?.type === "ACCOUNTS_UPDATED" || e.data?.type === "ACCOUNT_REMOVED") {
          loadAccounts();
        }
      };
      return () => bc.close();
    }
  }, []);

  const handleSwitch = async (userId: string) => {
    if (userId.toLowerCase() === currentUserId.toLowerCase()) return;
    setSwitching(userId);
    const success = await switchAlivAccount(userId);
    if (!success) {
      // If direct switch without password fails (non-master account), redirect to AlivOne sign in
      window.location.href = `${ALIVONE_PORTAL_URL}/auth?switch_to=${encodeURIComponent(userId)}&returnTo=${encodeURIComponent(window.location.href)}`;
    }
    setSwitching(null);
  };

  const handleRemove = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    if (userId === "shahdivy67") {
      alert("Master Admin account (shahdivy67) cannot be removed.");
      return;
    }
    if (confirm(`Remove account "${userId}" from all Aliv apps?`)) {
      removeAlivAccount(userId);
      loadAccounts();
    }
  };

  return (
    <div className={`p-4 rounded-2xl bg-card/90 border border-border shadow-xl backdrop-blur-md ${className}`}>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            AlivOne Switch Accounts
          </h3>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {accounts.length} active
        </span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {accounts.map((acc) => {
          const isActive = acc.userId.toLowerCase() === currentUserId.toLowerCase();
          return (
            <div
              key={acc.userId}
              onClick={() => handleSwitch(acc.userId)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? "bg-primary/10 border-primary/40 shadow-sm"
                  : "bg-background/40 hover:bg-muted/60 border-border/40"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {acc.userId.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold truncate text-foreground">
                      @{acc.userId}
                    </p>
                    {acc.plan && acc.plan !== "free" && (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium">
                        {acc.plan.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{acc.name || acc.userId}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {isActive ? (
                  <span className="flex items-center gap-1 text-[11px] text-primary font-medium px-2 py-0.5 rounded-md bg-primary/15">
                    <Check className="w-3 h-3 stroke-[3]" /> Active
                  </span>
                ) : (
                  <button
                    disabled={switching === acc.userId}
                    className="text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/50 hover:bg-muted transition-colors flex items-center gap-1"
                  >
                    {switching === acc.userId ? "Switching..." : "Switch"}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {acc.userId !== "shahdivy67" && (
                  <button
                    onClick={(e) => handleRemove(e, acc.userId)}
                    title="Remove from all apps"
                    className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-border/60">
        <a
          href={`${ALIVONE_PORTAL_URL}/auth?mode=signup`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add / Register New Account in AlivOne
        </a>
      </div>
    </div>
  );
};
