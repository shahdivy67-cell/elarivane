import { SimulatorCompletionRecord, UnfinishedSimulationProgress } from '../types/visualSimulator';

const STORAGE_KEY_COMPLETIONS = 'alivane_simulator_completions_v2';
const STORAGE_KEY_PROGRESS = 'alivane_simulator_progress_v2';

// 1. Get all permanently completed simulator records
export function getCompletedSimulatorRecords(): SimulatorCompletionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read completions from storage', err);
    return [];
  }
}

// 2. Check if a simulator ID is permanently completed
export function isSimulatorCompleted(simulatorId: string): boolean {
  const records = getCompletedSimulatorRecords();
  return records.some(r => r.simulatorId === simulatorId);
}

// 3. Record completion permanently (Idempotent - never creates duplicates or resets)
export function recordSimulatorCompletion(record: SimulatorCompletionRecord): void {
  try {
    const existing = getCompletedSimulatorRecords();
    // Check if already completed
    const alreadyCompletedIndex = existing.findIndex(r => r.simulatorId === record.simulatorId);

    let updated: SimulatorCompletionRecord[];
    if (alreadyCompletedIndex >= 0) {
      // In review mode: update existing record if new score is higher, without creating duplicate
      updated = existing.map((r, i) =>
        i === alreadyCompletedIndex
          ? {
              ...r,
              score: Math.max(r.score, record.score),
              userAnswers: record.userAnswers,
              completedAt: r.completedAt, // preserve original timestamp
            }
          : r
      );
    } else {
      updated = [record, ...existing];
    }

    localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(updated));

    // Remove any unfinished in-progress state for this simulator
    clearUnfinishedProgress(record.simulatorId);
  } catch (err) {
    console.error('Failed to save completion record', err);
  }
}

// 4. Save in-progress state so unfinished simulators can be resumed
export function saveUnfinishedProgress(simulatorId: string, state: Record<string, any>): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    const existing: Record<string, UnfinishedSimulationProgress> = raw ? JSON.parse(raw) : {};
    existing[simulatorId] = {
      simulatorId,
      updatedAt: new Date().toISOString(),
      state,
    };
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save progress', err);
  }
}

// 5. Load in-progress state for resuming
export function getUnfinishedProgress(simulatorId: string): Record<string, any> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return null;
    const existing: Record<string, UnfinishedSimulationProgress> = JSON.parse(raw);
    return existing[simulatorId]?.state || null;
  } catch (err) {
    return null;
  }
}

// 6. Clear in-progress state once finished
export function clearUnfinishedProgress(simulatorId: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return;
    const existing: Record<string, UnfinishedSimulationProgress> = JSON.parse(raw);
    delete existing[simulatorId];
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(existing));
  } catch (err) {
    // Silent catch
  }
}

// 7. Get all in-progress simulator IDs
export function getAllInProgressSimulatorIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return [];
    const existing: Record<string, UnfinishedSimulationProgress> = JSON.parse(raw);
    return Object.keys(existing);
  } catch (err) {
    return [];
  }
}

// 8. Export simulator records to JSON for local backup
export function exportSimulatorsDataPackage(): string {
  const completions = getCompletedSimulatorRecords();
  const rawProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
  const progress = rawProgress ? JSON.parse(rawProgress) : {};
  const rawCustom = localStorage.getItem('alivane_custom_simulators_v2');
  const custom = rawCustom ? JSON.parse(rawCustom) : [];

  return JSON.stringify(
    {
      version: 2,
      exportDate: new Date().toISOString(),
      completions,
      progress,
      customSimulators: custom,
    },
    null,
    2
  );
}

// 9. Import simulator records from JSON backup
export function importSimulatorsDataPackage(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.completions && Array.isArray(data.completions)) {
      const existing = getCompletedSimulatorRecords();
      // Merge unique by simulatorId
      const mergedMap = new Map<string, SimulatorCompletionRecord>();
      existing.forEach(r => mergedMap.set(r.simulatorId, r));
      data.completions.forEach((r: SimulatorCompletionRecord) => mergedMap.set(r.simulatorId, r));
      localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(Array.from(mergedMap.values())));
    }

    if (data.customSimulators && Array.isArray(data.customSimulators)) {
      localStorage.setItem('alivane_custom_simulators_v2', JSON.stringify(data.customSimulators));
    }
    return true;
  } catch (err) {
    console.error('Failed to import simulator data package', err);
    return false;
  }
}
