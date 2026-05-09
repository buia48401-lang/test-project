import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StyleType =
  | "white"
  | "lifestyle"
  | "detail"
  | "text-enhanced"
  | "model"
  | "360"
  | "package"
  | "compare"
  | "flatlay"
  | "macro"
  | "night"
  | "vintage";

export interface PromptResult {
  id: string;
  title: string;
  prompt: string;
  style: StyleType;
  icon: string;
}

export interface GeneratedPrompt {
  productName: string;
  platform: string;
  productType: string;
  prompts: PromptResult[];
}

export interface HistoryRecord {
  id: string;
  productName: string;
  platform: string;
  productType: string;
  prompts: PromptResult[];
  createdAt: number;
  copyCount: number;
}

export type SuggestionType =
  | "add"
  | "remove"
  | "replace"
  | "restructure"
  | "platform";

export interface OptimizationSuggestion {
  id: string;
  type: SuggestionType;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  apply: (prompt: string) => string;
}

export const PROMPT_MAX_LENGTH = 500;

export type ScoreGrade = "excellent" | "good" | "average" | "poor";

export interface ScoreDimension {
  name: string;
  weight: number;
  score: number;
  feedback: string;
}

export interface PromptScore {
  overall: number;
  dimensions: ScoreDimension[];
  grade: ScoreGrade;
  suggestions: string[];
}
