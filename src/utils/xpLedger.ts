import { SimulatorCompletionRecord } from '../types/visualSimulator';
import { getCompletedSimulatorRecords } from '../utils/simulatorStorage';

export interface XpTransaction {
  id: string;
  sourceType: 'simulator_quiz';
  simulatorId: string;
  simulatorTitle: string;
  score: number; // 0, 1, 2, 3
  xpAmount: number; // score * 10 (0, 10, 20, 30)
  timestamp: string;
}

const STORAGE_KEY_XP_LEDGER = 'alivane_xp_ledger_v2';
const STORAGE_KEY_MIGRATION_V2 = 'alivane_xp_reset_audit_v2_done';

/**
 * Executes a one-time, versioned data audit and reset.
 * 1. Resets XP balance to 0.
 * 2. Clears fake seed history, fake friends, and fake challenges from storage.
 * 3. Builds a clean transaction ledger strictly from legitimate quiz completions.
 */
export function runOneTimeDataIntegrityAudit(): void {
  try {
    const alreadyAudited = localStorage.getItem(STORAGE_KEY_MIGRATION_V2);
    if (alreadyAudited) return; // Run exactly once

    // 1. Clear old historical fake entries
    localStorage.removeItem('alivane_history_v1');
    localStorage.removeItem('elarivane_history_v1');
    localStorage.removeItem('alivane_friends_v1');
    localStorage.removeItem('elarivane_friends_v1');
    localStorage.removeItem('alivane_challenges_v1');
    localStorage.removeItem('elarivane_challenges_v1');

    // 2. Clear old XP keys or caches
    localStorage.removeItem('alivane_total_xp');
    localStorage.removeItem('alivane_xp_cache');

    // 3. Rebuild clean ledger from actual simulator completions (if any already completed legitimately)
    const completions = getCompletedSimulatorRecords();
    const cleanLedger: XpTransaction[] = [];
    completions.forEach(comp => {
      const earned = Math.max(0, Math.min(30, (comp.score || 0) * 10));
      cleanLedger.push({
        id: `tx_${comp.simulatorId}`,
        sourceType: 'simulator_quiz',
        simulatorId: comp.simulatorId,
        simulatorTitle: comp.simulatorTitle,
        score: comp.score,
        xpAmount: earned,
        timestamp: comp.completedAt,
      });
    });

    localStorage.setItem(STORAGE_KEY_XP_LEDGER, JSON.stringify(cleanLedger));

    // 4. Mark migration as permanently complete
    localStorage.setItem(STORAGE_KEY_MIGRATION_V2, 'true');
  } catch (err) {
    console.error('Audit migration error', err);
  }
}

/**
 * Gets all legitimate XP transactions from local ledger
 */
export function getXpLedger(): XpTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_XP_LEDGER);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Calculates current total XP strictly derived from legitimate transactions.
 * Returns 0 if no quiz completed yet.
 */
export function getDeterministicTotalXp(): number {
  const ledger = getXpLedger();
  return ledger.reduce((sum, tx) => sum + (tx.xpAmount || 0), 0);
}

/**
 * Awards XP for completing a simulator quiz.
 * Scoring rule: +10 XP per correct answer, maximum 30 XP (3/3).
 * Idempotent: awarded exactly once per simulator ID.
 */
export function awardQuizXp(
  simulatorId: string,
  simulatorTitle: string,
  score: number // 0, 1, 2, or 3
): { awardedXp: number; isFirstTime: boolean; totalXp: number } {
  try {
    const ledger = getXpLedger();
    const existingIndex = ledger.findIndex(tx => tx.simulatorId === simulatorId);

    // Exact scoring rule:
    // 3 correct = 30 XP
    // 2 correct = 20 XP
    // 1 correct = 10 XP
    // 0 correct = 0 XP
    const calculatedXp = Math.max(0, Math.min(30, Math.round(score) * 10));

    if (existingIndex >= 0) {
      // Already completed previously! Reviewing must NEVER award XP twice.
      return {
        awardedXp: 0,
        isFirstTime: false,
        totalXp: getDeterministicTotalXp(),
      };
    }

    const newTx: XpTransaction = {
      id: `tx_${simulatorId}_${Date.now()}`,
      sourceType: 'simulator_quiz',
      simulatorId,
      simulatorTitle,
      score,
      xpAmount: calculatedXp,
      timestamp: new Date().toISOString(),
    };

    const updated = [newTx, ...ledger];
    localStorage.setItem(STORAGE_KEY_XP_LEDGER, JSON.stringify(updated));

    const total = updated.reduce((sum, t) => sum + t.xpAmount, 0);
    return {
      awardedXp: calculatedXp,
      isFirstTime: true,
      totalXp: total,
    };
  } catch (err) {
    console.error('Failed to record XP transaction', err);
    return {
      awardedXp: 0,
      isFirstTime: false,
      totalXp: getDeterministicTotalXp(),
    };
  }
}
