"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Copy, Check, Trash2, ChevronDown } from "lucide-react";
import { cn, type HistoryRecord } from "@/lib/utils";
import { formatRelativeTime, groupHistoryByDate } from "@/lib/historyStorage";

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  history: HistoryRecord[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onLoad: (record: HistoryRecord) => void;
  onCopyPrompt: (recordId: string, promptId: string, text: string) => void;
  copiedKey: string | null;
}

const platformLabels: Record<string, string> = {
  default: "All Platforms",
  amazon: "Amazon",
  shopify: "Shopify",
  etsy: "Etsy",
  temu: "Temu",
  ebay: "eBay",
  "gpt-image-2": "ChatGPT Images 2.0",
};

const typeLabels: Record<string, string> = {
  default: "General",
  electronics: "Electronics",
  clothing: "Clothing",
  jewelry: "Jewelry",
  food: "Food",
  furniture: "Furniture",
  beauty: "Beauty",
};

function HistoryGroup({
  title,
  records,
  expandedId,
  setExpandedId,
  onDelete,
  onLoad,
  onCopyPrompt,
  copiedKey,
}: {
  title: string;
  records: HistoryRecord[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onDelete: (id: string) => void;
  onLoad: (record: HistoryRecord) => void;
  onCopyPrompt: (recordId: string, promptId: string, text: string) => void;
  copiedKey: string | null;
}) {
  if (records.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="px-1 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <ul className="space-y-2">
        {records.map((record) => {
          const isExpanded = expandedId === record.id;
          return (
            <li
              key={record.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : record.id)}
                className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">
                    {record.productName}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                    <span>{platformLabels[record.platform] ?? record.platform}</span>
                    <span aria-hidden>•</span>
                    <span>{typeLabels[record.productType] ?? record.productType}</span>
                    <span aria-hidden>•</span>
                    <span>{formatRelativeTime(record.createdAt)}</span>
                    {record.copyCount > 0 && (
                      <>
                        <span aria-hidden>•</span>
                        <span className="text-blue-600 font-medium">
                          {record.copyCount} {record.copyCount === 1 ? "copy" : "copies"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-slate-400 mt-1 transition-transform shrink-0",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-100 overflow-hidden"
                  >
                    <div className="p-3 space-y-2 bg-slate-50/60">
                      {record.prompts.map((p) => {
                        const key = `${record.id}:${p.id}`;
                        const justCopied = copiedKey === key;
                        return (
                          <div
                            key={p.id}
                            className="bg-white border border-slate-200 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-xs font-semibold text-slate-700">
                                {p.title}
                              </span>
                              <button
                                onClick={() =>
                                  onCopyPrompt(record.id, p.id, p.prompt)
                                }
                                className={cn(
                                  "flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors",
                                  justCopied
                                    ? "bg-green-50 text-green-600"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                )}
                              >
                                {justCopied ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Copy
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-xs font-mono text-slate-600 leading-relaxed break-words">
                              {p.prompt}
                            </p>
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onLoad(record)}
                          className="flex-1 text-xs font-medium px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Load this set
                        </button>
                        <button
                          onClick={() => onDelete(record.id)}
                          className="flex items-center justify-center px-2.5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          aria-label="Delete this record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function HistoryDrawer({
  open,
  onClose,
  history,
  onDelete,
  onClearAll,
  onLoad,
  onCopyPrompt,
  copiedKey,
}: HistoryDrawerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const groups = groupHistoryByDate(history);

  const handleLoad = (record: HistoryRecord) => {
    onLoad(record);
    onClose();
  };

  const handleClearAll = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      return;
    }
    onClearAll();
    setConfirmingClear(false);
    setExpandedId(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="history-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            key="history-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-slate-50 z-[70] shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Prompt history"
          >
            <header className="flex items-center justify-between px-5 h-14 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h2 className="font-semibold text-slate-900">History</h2>
                <span className="text-xs text-slate-500">
                  {history.length}/20
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="Close history"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              {history.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    No history yet
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Generated prompts will appear here.
                  </p>
                </div>
              ) : (
                <>
                  <HistoryGroup
                    title="Today"
                    records={groups.today}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                    onDelete={onDelete}
                    onLoad={handleLoad}
                    onCopyPrompt={onCopyPrompt}
                    copiedKey={copiedKey}
                  />
                  <HistoryGroup
                    title="Yesterday"
                    records={groups.yesterday}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                    onDelete={onDelete}
                    onLoad={handleLoad}
                    onCopyPrompt={onCopyPrompt}
                    copiedKey={copiedKey}
                  />
                  <HistoryGroup
                    title="Earlier"
                    records={groups.earlier}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                    onDelete={onDelete}
                    onLoad={handleLoad}
                    onCopyPrompt={onCopyPrompt}
                    copiedKey={copiedKey}
                  />
                </>
              )}
            </div>

            {history.length > 0 && (
              <footer className="px-4 py-3 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
                <button
                  onClick={handleClearAll}
                  onBlur={() => setConfirmingClear(false)}
                  className={cn(
                    "text-xs font-medium px-3 py-2 rounded-lg transition-colors",
                    confirmingClear
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  )}
                >
                  {confirmingClear ? "Confirm clear all" : "Clear all"}
                </button>
                <p className="text-xs text-slate-500">
                  Saved locally on this device
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
