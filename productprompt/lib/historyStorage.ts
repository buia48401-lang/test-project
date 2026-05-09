import type { HistoryRecord, PromptResult } from "./utils";

const STORAGE_KEY = "productprompt:history";
const MAX_RECORDS = 20;

function isClient(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadHistory(): HistoryRecord[] {
  if (!isClient()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

function persist(records: HistoryRecord[]) {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Storage might be full or unavailable; silently ignore.
  }
}

export function saveHistoryRecord(record: HistoryRecord): HistoryRecord[] {
  const current = loadHistory();
  const filtered = current.filter((r) => r.id !== record.id);
  const next = [record, ...filtered].slice(0, MAX_RECORDS);
  persist(next);
  return next;
}

export function deleteHistoryRecord(id: string): HistoryRecord[] {
  const next = loadHistory().filter((r) => r.id !== id);
  persist(next);
  return next;
}

export function clearHistory(): HistoryRecord[] {
  persist([]);
  return [];
}

export function updateHistoryPrompt(
  historyId: string,
  promptId: string,
  newPromptText: string
): HistoryRecord[] {
  const next = loadHistory().map((record) => {
    if (record.id !== historyId) return record;
    return {
      ...record,
      prompts: record.prompts.map((p: PromptResult) =>
        p.id === promptId ? { ...p, prompt: newPromptText } : p
      ),
    };
  });
  persist(next);
  return next;
}

export function incrementCopyCount(id: string): HistoryRecord[] {
  const next = loadHistory().map((record) =>
    record.id === id ? { ...record, copyCount: record.copyCount + 1 } : record
  );
  persist(next);
  return next;
}

export function createHistoryId(): string {
  return `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export type HistoryGroup = "today" | "yesterday" | "earlier";

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function groupHistoryByDate(records: HistoryRecord[]): {
  today: HistoryRecord[];
  yesterday: HistoryRecord[];
  earlier: HistoryRecord[];
} {
  const now = Date.now();
  const todayStart = startOfDay(now);
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  const groups = { today: [] as HistoryRecord[], yesterday: [] as HistoryRecord[], earlier: [] as HistoryRecord[] };
  for (const record of records) {
    if (record.createdAt >= todayStart) groups.today.push(record);
    else if (record.createdAt >= yesterdayStart) groups.yesterday.push(record);
    else groups.earlier.push(record);
  }
  return groups;
}

export function formatRelativeTime(ts: number): string {
  const diffMs = Date.now() - ts;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const d = new Date(ts);
  return d.toLocaleDateString();
}
