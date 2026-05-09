"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Pencil,
  Save,
  RotateCcw,
  X,
  Lightbulb,
  Plus,
  Minus,
  Replace,
  Wand2,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import {
  cn,
  PROMPT_MAX_LENGTH,
  type OptimizationSuggestion,
  type PromptResult,
  type PromptScore,
} from "@/lib/utils";
import { analyzePrompt } from "@/lib/promptOptimizer";
import { gradeColor, gradeLabel, gradeBarColor } from "@/lib/scoring";

interface PromptCardProps {
  prompt: PromptResult;
  originalText: string;
  platform: string;
  productType: string;
  index: number;
  copied: boolean;
  styleIcon: React.ReactNode;
  styleDescription: string;
  onCopy: (id: string, text: string) => void;
  onUpdate: (id: string, text: string) => void;
  score?: PromptScore;
  favoriteButton?: React.ReactNode;
}

const severityStyles: Record<OptimizationSuggestion["severity"], string> = {
  high: "bg-rose-50 text-rose-700 border-rose-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
};

const severityLabels: Record<OptimizationSuggestion["severity"], string> = {
  high: "High impact",
  medium: "Medium impact",
  low: "Low impact",
};

const typeIcons: Record<OptimizationSuggestion["type"], React.ReactNode> = {
  add: <Plus className="w-3.5 h-3.5" />,
  remove: <Minus className="w-3.5 h-3.5" />,
  replace: <Replace className="w-3.5 h-3.5" />,
  restructure: <Wand2 className="w-3.5 h-3.5" />,
  platform: <Lightbulb className="w-3.5 h-3.5" />,
};

export function PromptCard({
  prompt,
  originalText,
  platform,
  productType,
  index,
  copied,
  styleIcon,
  styleDescription,
  onCopy,
  onUpdate,
  score,
  favoriteButton,
}: PromptCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(prompt.prompt);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [showScore, setShowScore] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!editing) setDraft(prompt.prompt);
  }, [prompt.prompt, editing]);

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(draft.length, draft.length);
    }
    // We intentionally only run this on edit-mode toggle, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const suggestions = useMemo(
    () =>
      analyzePrompt(prompt.prompt, {
        platform,
        productType,
        style: prompt.style,
      })
        .filter((s) => !dismissedIds.includes(s.id) && !appliedIds.includes(s.id))
        .slice(0, 3),
    [prompt.prompt, platform, productType, prompt.style, dismissedIds, appliedIds]
  );

  const charCount = draft.length;
  const overLimit = charCount > PROMPT_MAX_LENGTH;
  const isDirty = draft !== prompt.prompt;
  const canRestore = prompt.prompt !== originalText || draft !== originalText;

  const handleStartEdit = () => {
    setDraft(prompt.prompt);
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(prompt.prompt);
    setEditing(false);
  };

  const handleSave = () => {
    if (overLimit) return;
    const trimmed = draft.trim();
    if (!trimmed) return;
    onUpdate(prompt.id, trimmed);
    setEditing(false);
  };

  const handleReset = () => {
    setDraft(originalText);
  };

  const handleApply = (suggestion: OptimizationSuggestion) => {
    const next = suggestion.apply(prompt.prompt).trim();
    if (!next || next.length > PROMPT_MAX_LENGTH) return;
    onUpdate(prompt.id, next);
    setAppliedIds((ids) => [...ids, suggestion.id]);
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((ids) => [...ids, id]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              prompt.style === "text-enhanced"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-blue-50 text-blue-600"
            )}
          >
            {styleIcon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 truncate">
                {prompt.title}
              </h3>
              {prompt.style === "text-enhanced" && (
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full uppercase tracking-wide">
                  Pro
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">{styleDescription}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Score Badge */}
          {score && !editing && (
            <button
              onClick={() => setShowScore((s) => !s)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all",
                gradeColor(score.grade)
              )}
              aria-label="Toggle score details"
            >
              <Star className="w-3.5 h-3.5" />
              {score.overall.toFixed(1)}
              <ChevronDown
                className={cn(
                  "w-3 h-3 transition-transform",
                  showScore && "rotate-180"
                )}
              />
            </button>
          )}
          {!editing && (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Edit prompt"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
          {favoriteButton && !editing && favoriteButton}
          <button
            onClick={() => onCopy(prompt.id, prompt.prompt)}
            disabled={editing}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              copied
                ? "bg-green-50 text-green-600"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700",
              editing && "opacity-50 cursor-not-allowed"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Score Details Panel */}
      <AnimatePresence>
        {showScore && score && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b border-slate-100"
          >
            <div className="px-5 py-4 bg-slate-50/80 space-y-4">
              {/* Overall */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    gradeColor(score.grade)
                  )}
                >
                  {score.grade === "excellent" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : score.grade === "poor" ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <TrendingUp className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {score.overall.toFixed(1)}/5.0
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full border",
                        gradeColor(score.grade)
                      )}
                    >
                      {gradeLabel(score.grade)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Overall quality score
                  </p>
                </div>
              </div>

              {/* Dimension Bars */}
              <div className="space-y-2.5">
                {score.dimensions.map((dim) => {
                  const pct = (dim.score / 5) * 100;
                  return (
                    <div key={dim.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">
                          {dim.name}
                        </span>
                        <span className="text-slate-500">
                          {dim.score.toFixed(1)}/5{" "}
                          <span className="text-slate-400">
                            ({Math.round(dim.weight * 100)}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 0.6,
                            delay: 0.1,
                            ease: "easeOut",
                          }}
                          className={cn(
                            "h-full rounded-full",
                            gradeBarColor(score.grade)
                          )}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {dim.feedback}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Suggestions */}
              {score.suggestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-slate-700">
                      Suggestions
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {score.suggestions.map((sg, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-600"
                      >
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        {sg}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="wait">
        {editing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-slate-50/50 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Original
                </label>
                <p className="mt-1 text-xs text-slate-500 font-mono leading-relaxed bg-white border border-slate-200 rounded-lg px-3 py-2 max-h-24 overflow-y-auto">
                  {originalText}
                </p>
              </div>
              <div>
                <label
                  htmlFor={`prompt-${prompt.id}`}
                  className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >
                  Edited
                </label>
                <textarea
                  id={`prompt-${prompt.id}`}
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={5}
                  className={cn(
                    "mt-1 w-full px-3 py-2 text-sm font-mono leading-relaxed border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all resize-y",
                    overLimit
                      ? "border-rose-400 focus:ring-rose-400"
                      : "border-slate-300 focus:ring-blue-500 focus:border-transparent"
                  )}
                />
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      "font-medium",
                      overLimit ? "text-rose-600" : "text-slate-500"
                    )}
                  >
                    {charCount} / {PROMPT_MAX_LENGTH}
                  </span>
                  {overLimit && (
                    <span className="text-rose-600">
                      Over the {PROMPT_MAX_LENGTH}-character limit
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                <button
                  onClick={handleReset}
                  disabled={!canRestore}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    canRestore
                      ? "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                      : "bg-white border border-slate-200 text-slate-300 cursor-not-allowed"
                  )}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to original
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={overLimit || !isDirty || !draft.trim()}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    !overLimit && isDirty && draft.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-5 py-4 bg-slate-50/50"
          >
            <p className="text-sm text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
              {prompt.prompt}
            </p>
            {prompt.prompt !== originalText && (
              <p className="mt-2 text-xs text-slate-400 italic">Edited</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!editing && suggestions.length > 0 && (
        <div className="px-5 py-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-1.5 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-semibold text-slate-900">
              AI Suggestions
            </h4>
            <span className="text-xs text-slate-400">
              ({suggestions.length})
            </span>
          </div>
          <ul className="space-y-2">
            {suggestions.map((s) => (
              <li
                key={s.id}
                className="flex items-start justify-between gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50/40"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md border shrink-0",
                      severityStyles[s.severity]
                    )}
                    aria-hidden
                  >
                    {typeIcons[s.type]}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-sm font-medium text-slate-900">
                        {s.title}
                      </p>
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
                          severityStyles[s.severity]
                        )}
                      >
                        {severityLabels[s.severity]}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleApply(s)}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => handleDismiss(s.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                    aria-label="Dismiss suggestion"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
