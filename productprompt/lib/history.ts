import { PromptResult } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  productName: string;
  platform: string;
  productType: string;
  prompts: PromptResult[];
  createdAt: number;
  copiedCount: number;
}

export interface GroupedHistory {
  today: HistoryItem[];
  yesterday: HistoryItem[];
  earlier: HistoryItem[];
}

const STORAGE_KEY = "productprompt-history";
const MAX_HISTORY = 20;

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistoryItem(
  productName: string,
  platform: string,
  productType: string,
  prompts: PromptResult[]
): HistoryItem {
  const item: HistoryItem = {
    id: generateId(),
    productName,
    platform,
    productType,
    prompts,
    createdAt: Date.now(),
    copiedCount: 0,
  };

  if (typeof window === "undefined") return item;

  const history = getHistory();
  const newHistory = [item, ...history];
  if (newHistory.length > MAX_HISTORY) {
    newHistory.length = MAX_HISTORY;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  return item;
}

export function deleteHistoryItem(id: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function incrementCopiedCount(id: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory().map((item) =>
    item.id === id ? { ...item, copiedCount: item.copiedCount + 1 } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

export function groupHistoryByDate(history: HistoryItem[]): GroupedHistory {
  const today: HistoryItem[] = [];
  const yesterday: HistoryItem[] = [];
  const earlier: HistoryItem[] = [];

  for (const item of history) {
    const date = new Date(item.createdAt);
    const now = new Date();
    if (isSameDay(date, now)) {
      today.push(item);
    } else if (isYesterday(date)) {
      yesterday.push(item);
    } else {
      earlier.push(item);
    }
  }

  return { today, yesterday, earlier };
}
