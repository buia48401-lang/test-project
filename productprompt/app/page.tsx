"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  Check,
  Wand2,
  Zap,
  Target,
  ChevronDown,
  Image,
  Square,
  ZoomIn,
  Type,
  Clock,
  Trash2,
  X,
  User,
  RotateCw,
  Package,
  GitCompare,
  LayoutGrid,
  Microscope,
  Moon,
  Film,
  ChevronUp,
  Crown,
  Heart,
  Tag,
  FolderPlus,
  Bookmark,
  List,
  FileText,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { cn, type GeneratedPrompt, type StyleType } from "@/lib/utils";
import { generatePrompts } from "@/lib/promptGenerator";
import { scorePrompt } from "@/lib/scoring";
import { PromptCard } from "@/app/_components/PromptCard";
import {
  getHistory,
  saveHistoryItem,
  deleteHistoryItem,
  incrementCopiedCount,
  groupHistoryByDate,
  type HistoryItem,
} from "@/lib/history";
import {
  exportToCSV,
  exportToTXT,
  downloadFile,
  getExportFilename,
  normalizeExportData,
} from "@/lib/export";
import {
  getFavorites,
  getCollections,
  getFavoriteId,
  saveFavorite,
  deleteFavorite,
  updateFavoriteTags,
  createCollection,
  addToCollection,
  removeFromCollection,
  deleteCollection,
  renameCollection,
  type FavoriteItem,
  type Collection,
} from "@/lib/favorites";

const platforms = [
  { value: "default", label: "All Platforms" },
  { value: "amazon", label: "Amazon" },
  { value: "shopify", label: "Shopify" },
  { value: "etsy", label: "Etsy" },
  { value: "temu", label: "Temu" },
  { value: "ebay", label: "eBay" },
  { value: "gpt-image-2", label: "ChatGPT Images 2.0" },
];

const productTypes = [
  { value: "default", label: "General" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "jewelry", label: "Jewelry" },
  { value: "food", label: "Food" },
  { value: "furniture", label: "Furniture" },
  { value: "beauty", label: "Beauty" },
];

const basicStyles: StyleType[] = ["white", "lifestyle", "detail"];
const proStyles: StyleType[] = [
  "model",
  "360",
  "package",
  "compare",
  "flatlay",
  "macro",
  "night",
  "vintage",
];

const styleIcons: Record<StyleType, React.ReactNode> = {
  white: <Square className="w-5 h-5" />,
  lifestyle: <Image className="w-5 h-5" />,
  detail: <ZoomIn className="w-5 h-5" />,
  "text-enhanced": <Type className="w-5 h-5" />,
  model: <User className="w-5 h-5" />,
  "360": <RotateCw className="w-5 h-5" />,
  package: <Package className="w-5 h-5" />,
  compare: <GitCompare className="w-5 h-5" />,
  flatlay: <LayoutGrid className="w-5 h-5" />,
  macro: <Microscope className="w-5 h-5" />,
  night: <Moon className="w-5 h-5" />,
  vintage: <Film className="w-5 h-5" />,
};

const styleLabels: Record<StyleType, string> = {
  white: "White Background",
  lifestyle: "Lifestyle Scene",
  detail: "Detail Close-up",
  "text-enhanced": "Text-Enhanced",
  model: "Model Shot",
  "360": "360° View",
  package: "Packaging",
  compare: "Comparison",
  flatlay: "Flat Lay",
  macro: "Macro Shot",
  night: "Night Scene",
  vintage: "Vintage",
};

const styleDescriptions: Record<StyleType, string> = {
  white: "Clean white background, perfect for marketplace listings",
  lifestyle: "Real-world scene, great for social media and ads",
  detail: "Close-up macro shot, highlight product craftsmanship",
  "text-enhanced": "Text-rich marketing visual with labels, badges, and typography (Images 2.0)",
  model: "Worn by professional model, full body fashion editorial",
  "360": "Rotating product view on turntable, all angles visible",
  package: "Premium unboxing experience, gift-ready presentation",
  compare: "Before and after split screen, dramatic transformation",
  flatlay: "Top-down arranged composition, styled overhead view",
  macro: "Extreme close-up, microscopic texture and detail focus",
  night: "Neon-lit night scene, cyberpunk futuristic atmosphere",
  vintage: "Retro film look, nostalgic warm analog color grading",
};

function isProStyle(style: StyleType): boolean {
  return proStyles.includes(style);
}

export default function Home() {
  const [productName, setProductName] = useState("");
  const [platform, setPlatform] = useState("default");
  const [productType, setProductType] = useState("default");
  const [result, setResult] = useState<GeneratedPrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [historyCopiedId, setHistoryCopiedId] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<StyleType[]>(["white", "lifestyle", "detail"]);
  const [showProStyles, setShowProStyles] = useState(false);

  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [favCopiedId, setFavCopiedId] = useState<string | null>(null);
  const [expandedFavId, setExpandedFavId] = useState<string | null>(null);
  const [favTagEditId, setFavTagEditId] = useState<string | null>(null);
  const [favTagInput, setFavTagInput] = useState("");
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* Batch mode states */
  const [batchMode, setBatchMode] = useState(false);
  const [batchInput, setBatchInput] = useState("");
  const [batchResults, setBatchResults] = useState<GeneratedPrompt[] | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchCopiedId, setBatchCopiedId] = useState<string | null>(null);
  const [batchExpandedIds, setBatchExpandedIds] = useState<Set<string>>(new Set());
  const [batchCopiedAll, setBatchCopiedAll] = useState(false);

  /* Export dropdown states */
  const [showSingleExport, setShowSingleExport] = useState(false);
  const [showBatchExport, setShowBatchExport] = useState(false);

  const refreshHistory = useCallback(() => {
    setHistoryItems(getHistory());
  }, []);

  const refreshFavorites = useCallback(() => {
    setFavoriteItems(getFavorites());
    setCollections(getCollections());
  }, []);

  useEffect(() => {
    refreshHistory();
    refreshFavorites();
  }, [refreshHistory, refreshFavorites]);

  const toggleStyle = (style: StyleType) => {
    setSelectedStyles((prev) => {
      if (prev.includes(style)) {
        if (prev.length <= 1) return prev; // keep at least one
        return prev.filter((s) => s !== style);
      }
      return [...prev, style];
    });
  };

  const handleGenerate = async () => {
    if (!productName.trim()) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const generated = generatePrompts(productName.trim(), platform, productType, selectedStyles);
    setResult(generated);
    setLoading(false);
    saveHistoryItem(
      generated.productName,
      generated.platform,
      generated.productType,
      generated.prompts
    );
    refreshHistory();
  };

  const handleBatchGenerate = async () => {
    const lines = batchInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) return;
    setBatchLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const results: GeneratedPrompt[] = [];
    for (const name of lines) {
      const generated = generatePrompts(name, platform, productType, selectedStyles);
      results.push(generated);
      saveHistoryItem(
        generated.productName,
        generated.platform,
        generated.productType,
        generated.prompts
      );
    }
    setBatchResults(results);
    setBatchLoading(false);
    refreshHistory();
    // expand first card by default
    if (results.length > 0) {
      setBatchExpandedIds(new Set([results[0].productName]));
    }
  };

  const handleCopy = async (promptId: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(promptId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBatchCopy = async (promptId: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setBatchCopiedId(promptId);
    setTimeout(() => setBatchCopiedId(null), 2000);
  };

  const handleBatchCopyAll = async () => {
    if (!batchResults || batchResults.length === 0) return;
    const allText = batchResults
      .map(
        (r) =>
          `--- ${r.productName} ---\n` +
          r.prompts.map((p) => `[${p.title}]\n${p.prompt}`).join("\n\n")
      )
      .join("\n\n");
    await navigator.clipboard.writeText(allText);
    setBatchCopiedAll(true);
    setTimeout(() => setBatchCopiedAll(false), 2000);
  };

  const handleExportDownload = (
    data: GeneratedPrompt[] | GeneratedPrompt,
    format: "csv" | "txt"
  ) => {
    const normalized = normalizeExportData(data);
    const content = format === "csv" ? exportToCSV(normalized) : exportToTXT(normalized);
    const filename = getExportFilename(data, format);
    const mimeType = format === "csv" ? "text/csv;charset=utf-8;" : "text/plain;charset=utf-8;";
    downloadFile(content, filename, mimeType);
  };

  const handleExportCopy = async (
    data: GeneratedPrompt[] | GeneratedPrompt,
    format: "csv" | "txt"
  ) => {
    const normalized = normalizeExportData(data);
    const content = format === "csv" ? exportToCSV(normalized) : exportToTXT(normalized);
    await navigator.clipboard.writeText(content);
    setToast(`Copied as ${format.toUpperCase()}`);
    setTimeout(() => setToast(null), 2000);
  };

  const toggleBatchExpanded = (productName: string) => {
    setBatchExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productName)) {
        next.delete(productName);
      } else {
        next.add(productName);
      }
      return next;
    });
  };

  const handleFavoriteToggle = (
    productName: string,
    platform: string,
    productType: string,
    style: string,
    styleTitle: string,
    prompt: string
  ) => {
    const existingId = getFavoriteId(productName, style);
    if (existingId) {
      deleteFavorite(existingId);
      setToast("Removed from favorites");
    } else {
      saveFavorite(productName, platform, productType, style, styleTitle, prompt);
      setToast("Added to favorites");
    }
    refreshFavorites();
    setTimeout(() => setToast(null), 2000);
  };

  const handleFavCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setFavCopiedId(id);
    setTimeout(() => setFavCopiedId(null), 2000);
  };

  const handleDeleteFav = (id: string) => {
    deleteFavorite(id);
    refreshFavorites();
    if (expandedFavId === id) setExpandedFavId(null);
  };

  const handleAddTag = (id: string) => {
    const item = favoriteItems.find((f) => f.id === id);
    if (!item) return;
    const newTag = favTagInput.trim();
    if (!newTag) return;
    if (item.tags.includes(newTag)) return;
    updateFavoriteTags(id, [...item.tags, newTag]);
    setFavTagInput("");
    refreshFavorites();
  };

  const handleRemoveTag = (id: string, tag: string) => {
    const item = favoriteItems.find((f) => f.id === id);
    if (!item) return;
    updateFavoriteTags(id, item.tags.filter((t) => t !== tag));
    refreshFavorites();
  };

  const handleCreateCollection = () => {
    const name = newCollectionName.trim();
    if (!name) return;
    createCollection(name);
    setNewCollectionName("");
    setShowNewCollection(false);
    refreshFavorites();
  };

  const handleAddToCollection = (collectionId: string, itemId: string) => {
    addToCollection(collectionId, itemId);
    refreshFavorites();
    setToast("Added to collection");
    setTimeout(() => setToast(null), 2000);
  };

  const handleHistoryCopy = async (
    historyId: string,
    promptId: string,
    text: string
  ) => {
    await navigator.clipboard.writeText(text);
    setHistoryCopiedId(promptId);
    incrementCopiedCount(historyId);
    refreshHistory();
    setTimeout(() => setHistoryCopiedId(null), 2000);
  };

  const handleDeleteHistoryItem = (id: string) => {
    deleteHistoryItem(id);
    refreshHistory();
    if (expandedHistoryId === id) {
      setExpandedHistoryId(null);
    }
  };

  const groupedHistory = groupHistoryByDate(historyItems);

  const exampleProducts = [
    "Wireless Earbuds",
    "Skincare Serum",
    "Leather Wallet",
    "Coffee Mug",
  ];

  const batchExample = `Wireless Earbuds
Skincare Serum
Leather Wallet
Coffee Mug`;

  const inputDisabled = loading || batchLoading;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">
              ProductPrompt<span className="text-blue-600">.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
              <a href="#features" className="hover:text-slate-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="hover:text-slate-900 transition-colors">
                Pricing
              </a>
            </nav>
            <button
              onClick={() => setShowFavorites(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open favorites"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
              {favoriteItems.length > 0 && (
                <span className="ml-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favoriteItems.length > 99 ? "99+" : favoriteItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open history"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              AI Product Photo{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Prompts
              </span>{" "}
              in Seconds
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              Generate professional prompts for Midjourney, Flux & more. Perfect
              for Amazon, Shopify, Etsy sellers.
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-4">
              {/* Mode Toggle */}
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => {
                      setBatchMode(false);
                      setBatchResults(null);
                      setResult(null);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      !batchMode
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <FileText className="w-4 h-4" />
                    Single
                  </button>
                  <button
                    onClick={() => {
                      setBatchMode(true);
                      setResult(null);
                      setBatchResults(null);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      batchMode
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <List className="w-4 h-4" />
                    Batch
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!batchMode ? (
                  <motion.div
                    key="single"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Enter your product name..."
                      className="w-full px-4 py-3.5 pr-12 text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                      disabled={inputDisabled}
                    />
                    <Wand2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="batch"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <textarea
                      value={batchInput}
                      onChange={(e) => setBatchInput(e.target.value)}
                      placeholder="Enter products (one per line). Maximum 10 products per batch."
                      className="w-full px-4 py-3.5 pr-12 text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] resize-y"
                      disabled={inputDisabled}
                    />
                    <List className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
                    <p className="text-xs text-slate-400 mt-1.5 text-left">
                      {batchInput.split("\n").filter((l) => l.trim().length > 0).length} products entered
                      {batchInput.split("\n").filter((l) => l.trim().length > 0).length > 10 && (
                        <span className="text-amber-600 ml-1">(Maximum 10 recommended)</span>
                      )}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                {/* Platform Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowPlatformDropdown(!showPlatformDropdown);
                      setShowTypeDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 hover:border-slate-400 transition-colors"
                  >
                    <span>
                      {platforms.find((p) => p.value === platform)?.label}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {showPlatformDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden"
                      >
                        {platforms.map((p) => (
                          <button
                            key={p.value}
                            onClick={() => {
                              setPlatform(p.value);
                              setShowPlatformDropdown(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors",
                              platform === p.value && "bg-blue-50 text-blue-600"
                            )}
                          >
                            {p.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Product Type Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowTypeDropdown(!showTypeDropdown);
                      setShowPlatformDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 hover:border-slate-400 transition-colors"
                  >
                    <span>
                      {productTypes.find((t) => t.value === productType)?.label}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {showTypeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden"
                      >
                        {productTypes.map((t) => (
                          <button
                            key={t.value}
                            onClick={() => {
                              setProductType(t.value);
                              setShowTypeDropdown(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors",
                              productType === t.value && "bg-blue-50 text-blue-600"
                            )}
                          >
                            {t.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Style Selector */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700">Style Selector</h3>
                  <span className="text-xs text-slate-400">
                    {selectedStyles.length} selected
                  </span>
                </div>

                {/* Basic Styles */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-slate-500 mb-2">Basic Styles (Free)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {basicStyles.map((style) => (
                      <motion.button
                        key={style}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleStyle(style)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg border text-xs font-medium transition-all",
                          selectedStyles.includes(style)
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        )}
                      >
                        <span className={cn(
                          "w-8 h-8 rounded-md flex items-center justify-center",
                          selectedStyles.includes(style) ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                        )}>
                          {styleIcons[style]}
                        </span>
                        <span className="text-center leading-tight">{styleLabels[style]}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Pro Styles Header */}
                <button
                  onClick={() => setShowProStyles(!showProStyles)}
                  className="w-full flex items-center justify-between py-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    Pro Styles
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full uppercase tracking-wide">
                      Pro
                    </span>
                  </span>
                  <motion.div
                    animate={{ rotate: showProStyles ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Pro Styles Grid */}
                <AnimatePresence initial={false}>
                  {showProStyles && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {proStyles.map((style) => (
                          <motion.button
                            key={style}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleStyle(style)}
                            className={cn(
                              "flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg border text-xs font-medium transition-all relative",
                              selectedStyles.includes(style)
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            )}
                          >
                            <span className={cn(
                              "w-8 h-8 rounded-md flex items-center justify-center",
                              selectedStyles.includes(style) ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                            )}>
                              {styleIcons[style]}
                            </span>
                            <span className="text-center leading-tight">{styleLabels[style]}</span>
                            {!selectedStyles.includes(style) && (
                              <span className="absolute -top-1.5 -right-1.5 px-1 py-[1px] bg-emerald-500 text-white text-[8px] font-bold rounded-full uppercase tracking-wide">
                                Pro
                              </span>
                            )}
                          </motion.button>
                        ))}
                      </div>
                      <div className="mt-3 text-center">
                        <p className="text-xs text-slate-500">
                          ✨{" "}
                          <a href="#pricing" className="text-blue-600 hover:underline">
                            Upgrade to Pro
                          </a>{" "}
                          to unlock 8+ premium styles
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Generate Button */}
              <button
                onClick={batchMode ? handleBatchGenerate : handleGenerate}
                disabled={
                  inputDisabled ||
                  (batchMode
                    ? batchInput.trim().length === 0
                    : productName.trim().length === 0)
                }
                className={cn(
                  "w-full py-3.5 rounded-xl font-semibold text-white text-base transition-all flex items-center justify-center gap-2",
                  (batchMode ? batchInput.trim() : productName.trim()) && !inputDisabled
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
                    : "bg-slate-300 cursor-not-allowed"
                )}
              >
                {inputDisabled ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {batchMode ? "Generating Batch..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {batchMode ? "Generate Batch" : "Generate Prompts"}
                  </>
                )}
              </button>
            </div>

            {/* Examples */}
            {!batchMode ? (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className="text-slate-500">Try:</span>
                {exampleProducts.map((example) => (
                  <button
                    key={example}
                    onClick={() => setProductName(example)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className="text-slate-500">Try batch:</span>
                <button
                  onClick={() => setBatchInput(batchExample)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
                >
                  4 products
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Single Results Section */}
      <AnimatePresence>
        {!batchMode && result && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="pb-16 px-4 sm:px-6"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Generated {result.prompts.length} Prompts for{" "}
                  <span className="text-blue-600">&quot;{result.productName}&quot;</span>
                </h2>
              </div>

              {result.platform === "gpt-image-2" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-emerald-900 text-sm">
                        ChatGPT Images 2.0 Optimized
                      </h3>
                      <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                        These prompts leverage Images 2.0 capabilities: precise text rendering,
                        multi-language support, complex compositions with labels and UI elements,
                        and up to 2K resolution. Perfect for marketing materials, posters,
                        menus, and product visuals with integrated typography.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Single Result Actions */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={async () => {
                    const allText = result.prompts
                      .map((p) => `[${p.title}]\n${p.prompt}`)
                      .join("\n\n");
                    await navigator.clipboard.writeText(allText);
                    setCopiedId("all");
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    copiedId === "all"
                      ? "bg-green-50 text-green-600"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  )}
                >
                  {copiedId === "all" ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied All!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy All
                    </>
                  )}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowSingleExport(!showSingleExport)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform",
                        showSingleExport && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {showSingleExport && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden min-w-[220px]"
                      >
                        <button
                          onClick={() => {
                            handleExportDownload(result, "csv");
                            setShowSingleExport(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-green-600" />
                          Export as CSV
                        </button>
                        <button
                          onClick={() => {
                            handleExportDownload(result, "txt");
                            setShowSingleExport(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <FileText className="w-4 h-4 text-blue-600" />
                          Export as TXT
                        </button>
                        <div className="border-t border-slate-100" />
                        <button
                          onClick={() => {
                            handleExportCopy(result, "csv");
                            setShowSingleExport(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <Copy className="w-4 h-4 text-slate-500" />
                          Copy as CSV
                        </button>
                        <button
                          onClick={() => {
                            handleExportCopy(result, "txt");
                            setShowSingleExport(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <Copy className="w-4 h-4 text-slate-500" />
                          Copy as TXT
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                >
                  <RotateCw className="w-4 h-4" />
                  Regenerate
                </button>
              </div>

              <div className="space-y-4">
                {result.prompts.map((prompt, index) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    originalText={prompt.prompt}
                    platform={result.platform}
                    productType={result.productType}
                    index={index}
                    copied={copiedId === prompt.id}
                    styleIcon={styleIcons[prompt.style]}
                    styleDescription={styleDescriptions[prompt.style]}
                    onCopy={handleCopy}
                    onUpdate={(id, text) => {
                      setResult((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          prompts: prev.prompts.map((p) =>
                            p.id === id ? { ...p, prompt: text } : p
                          ),
                        };
                      });
                    }}
                    score={scorePrompt(
                      prompt.prompt,
                      result.productName,
                      result.platform,
                      prompt.style
                    )}
                    favoriteButton={
                      <button
                        onClick={() =>
                          handleFavoriteToggle(
                            result.productName,
                            result.platform,
                            result.productType,
                            prompt.style,
                            prompt.title,
                            prompt.prompt
                          )
                        }
                        className="p-2 rounded-lg transition-all hover:bg-red-50"
                        aria-label="Toggle favorite"
                      >
                        <motion.div
                          whileTap={{ scale: 0.8 }}
                          animate={
                            getFavoriteId(result.productName, prompt.style)
                              ? { scale: [1, 1.2, 1] }
                              : {}
                          }
                          transition={{ duration: 0.3 }}
                        >
                          {getFavoriteId(result.productName, prompt.style) ? (
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                          ) : (
                            <Heart className="w-5 h-5 text-slate-400 hover:text-red-500 transition-colors" />
                          )}
                        </motion.div>
                      </button>
                    }
                  />
                ))}
              </div>

              {/* Upgrade CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-slate-500">
                  ✨{" "}
                  <a href="#pricing" className="text-blue-600 hover:underline">
                    Upgrade to Pro
                  </a>{" "}
                  for 50+ templates, bulk generation, and advanced options
                </p>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Batch Results Section */}
      <AnimatePresence>
        {batchMode && batchResults && batchResults.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="pb-16 px-4 sm:px-6"
          >
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Batch Results
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBatchCopyAll}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                      batchCopiedAll
                        ? "bg-green-50 text-green-600"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    )}
                  >
                    {batchCopiedAll ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied All!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All
                      </>
                    )}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowBatchExport(!showBatchExport)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Export
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform",
                          showBatchExport && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {showBatchExport && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden min-w-[220px]"
                        >
                          <button
                            onClick={() => {
                              handleExportDownload(batchResults, "csv");
                              setShowBatchExport(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                            Export as CSV
                          </button>
                          <button
                            onClick={() => {
                              handleExportDownload(batchResults, "txt");
                              setShowBatchExport(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                          >
                            <FileText className="w-4 h-4 text-blue-600" />
                            Export as TXT
                          </button>
                          <div className="border-t border-slate-100" />
                          <button
                            onClick={() => {
                              handleExportCopy(batchResults, "csv");
                              setShowBatchExport(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                          >
                            <Copy className="w-4 h-4 text-slate-500" />
                            Copy as CSV
                          </button>
                          <button
                            onClick={() => {
                              handleExportCopy(batchResults, "txt");
                              setShowBatchExport(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                          >
                            <Copy className="w-4 h-4 text-slate-500" />
                            Copy as TXT
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  Generated{" "}
                  <span className="font-semibold">{batchResults.length}</span>{" "}
                  products ({" "}
                  <span className="font-semibold">
                    {batchResults.reduce((sum, r) => sum + r.prompts.length, 0)}
                  </span>{" "}
                  prompts)
                </p>
              </div>

              {/* Product Cards */}
              <div className="space-y-3">
                {batchResults.map((productResult, productIndex) => (
                  <BatchProductCard
                    key={productResult.productName + productIndex}
                    productResult={productResult}
                    index={productIndex}
                    expanded={batchExpandedIds.has(productResult.productName)}
                    onToggle={() => toggleBatchExpanded(productResult.productName)}
                    onCopy={handleBatchCopy}
                    onFavoriteToggle={handleFavoriteToggle}
                    copiedId={batchCopiedId}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">
            Why Sellers Love ProductPrompt
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Multi-Platform",
                desc: "Optimized for Amazon, Shopify, Etsy, Temu, and eBay. One tool, all platforms.",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "Instant Generation",
                desc: "Get 3 professional prompts in under 3 seconds. No more trial and error.",
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Conversion Optimized",
                desc: "Prompts designed for high CTR. More clicks, more sales, more revenue.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Enter Product", desc: "Type your product name and select platform" },
              { step: "2", title: "Choose Style", desc: "Pick from white, lifestyle, detail, or 8+ Pro styles" },
              { step: "3", title: "Get Prompts", desc: "AI generates professional prompts instantly" },
              { step: "4", title: "Copy & Generate", desc: "Paste into Midjourney, Flux, DALL-E, or ChatGPT Images 2.0" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-4 sm:px-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">
            Simple Pricing
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: [
                  "5 prompts per day",
                  "3 basic styles",
                  "All platforms",
                  "Copy to clipboard",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "$9.9",
                period: "/month",
                features: [
                  "Unlimited prompts",
                  "11+ styles (Basic + Pro)",
                  "Bulk generation",
                  "Priority support",
                  "Advanced options",
                ],
                cta: "Start Pro Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$49",
                period: "/month",
                features: [
                  "Everything in Pro",
                  "API access",
                  "Custom branding",
                  "Dedicated support",
                  "Team collaboration",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "rounded-2xl border p-6",
                  plan.popular
                    ? "border-blue-500 shadow-lg shadow-blue-500/10 relative"
                    : "border-slate-200"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-semibold text-slate-900">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    "w-full py-2.5 rounded-xl font-medium text-sm transition-colors",
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">
              ProductPrompt<span className="text-blue-600">.ai</span>
            </span>
          </div>
          <p className="text-sm text-slate-500">
            © 2025 ProductPrompt.ai · Made for sellers, by sellers
          </p>
        </div>
      </footer>

      {/* History Drawer */}
      <AnimatePresence>
        {showHistory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowHistory(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-600" />
                  <h2 className="font-semibold text-slate-900">History</h2>
                  {historyItems.length > 0 && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {historyItems.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Close history"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {historyItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Clock className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-sm text-slate-500">No history yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Generated prompts will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Today */}
                    {groupedHistory.today.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Today
                        </h3>
                        <div className="space-y-3">
                          {groupedHistory.today.map((item) => (
                            <HistoryCard
                              key={item.id}
                              item={item}
                              expanded={expandedHistoryId === item.id}
                              onToggle={() =>
                                setExpandedHistoryId(
                                  expandedHistoryId === item.id ? null : item.id
                                )
                              }
                              onCopy={handleHistoryCopy}
                              onDelete={handleDeleteHistoryItem}
                              copiedId={historyCopiedId}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Yesterday */}
                    {groupedHistory.yesterday.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Yesterday
                        </h3>
                        <div className="space-y-3">
                          {groupedHistory.yesterday.map((item) => (
                            <HistoryCard
                              key={item.id}
                              item={item}
                              expanded={expandedHistoryId === item.id}
                              onToggle={() =>
                                setExpandedHistoryId(
                                  expandedHistoryId === item.id ? null : item.id
                                )
                              }
                              onCopy={handleHistoryCopy}
                              onDelete={handleDeleteHistoryItem}
                              copiedId={historyCopiedId}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Earlier */}
                    {groupedHistory.earlier.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Earlier
                        </h3>
                        <div className="space-y-3">
                          {groupedHistory.earlier.map((item) => (
                            <HistoryCard
                              key={item.id}
                              item={item}
                              expanded={expandedHistoryId === item.id}
                              onToggle={() =>
                                setExpandedHistoryId(
                                  expandedHistoryId === item.id ? null : item.id
                                )
                              }
                              onCopy={handleHistoryCopy}
                              onDelete={handleDeleteHistoryItem}
                              copiedId={historyCopiedId}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Favorites Drawer */}
      <AnimatePresence>
        {showFavorites && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowFavorites(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <h2 className="font-semibold text-slate-900">My Favorites</h2>
                  {favoriteItems.length > 0 && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {favoriteItems.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewCollection(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    New
                  </button>
                  <button
                    onClick={() => setShowFavorites(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Close favorites"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {favoriteItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Heart className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-sm text-slate-500">No favorites yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click the heart icon on any prompt to save it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Uncollected Favorites */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          All Favorites
                        </h3>
                        <span className="text-xs text-slate-400">
                          {favoriteItems.length} prompts
                        </span>
                      </div>
                      <div className="space-y-3">
                        {favoriteItems.map((item) => (
                          <FavoriteCard
                            key={item.id}
                            item={item}
                            collections={collections}
                            expanded={expandedFavId === item.id}
                            onToggle={() =>
                              setExpandedFavId(
                                expandedFavId === item.id ? null : item.id
                              )
                            }
                            onCopy={handleFavCopy}
                            onDelete={handleDeleteFav}
                            onAddTag={handleAddTag}
                            onRemoveTag={handleRemoveTag}
                            onAddToCollection={handleAddToCollection}
                            copiedId={favCopiedId}
                            tagEditId={favTagEditId}
                            setTagEditId={setFavTagEditId}
                            tagInput={favTagInput}
                            setTagInput={setFavTagInput}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Collections */}
                    {collections.length > 0 && (
                      <div className="space-y-4">
                        {collections.map((col) => {
                          const colItems = favoriteItems.filter((f) =>
                            col.itemIds.includes(f.id)
                          );
                          if (colItems.length === 0) return null;
                          return (
                            <div key={col.id}>
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <Bookmark className="w-3.5 h-3.5" />
                                  {col.name}
                                </h3>
                                <span className="text-xs text-slate-400">
                                  {colItems.length} prompts
                                </span>
                              </div>
                              <div className="space-y-3">
                                {colItems.map((item) => (
                                  <FavoriteCard
                                    key={item.id}
                                    item={item}
                                    collections={collections}
                                    expanded={expandedFavId === item.id}
                                    onToggle={() =>
                                      setExpandedFavId(
                                        expandedFavId === item.id
                                          ? null
                                          : item.id
                                      )
                                    }
                                    onCopy={handleFavCopy}
                                    onDelete={handleDeleteFav}
                                    onAddTag={handleAddTag}
                                    onRemoveTag={handleRemoveTag}
                                    onAddToCollection={handleAddToCollection}
                                    copiedId={favCopiedId}
                                    tagEditId={favTagEditId}
                                    setTagEditId={setFavTagEditId}
                                    tagInput={favTagInput}
                                    setTagInput={setFavTagInput}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Collection Modal */}
      <AnimatePresence>
        {showNewCollection && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setShowNewCollection(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm pointer-events-auto">
                <h3 className="font-semibold text-slate-900 mb-4">
                  New Collection
                </h3>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateCollection();
                  }}
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowNewCollection(false)}
                    className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCollection}
                    disabled={!newCollectionName.trim()}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-green-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* Batch Product Card Component */
function BatchProductCard({
  productResult,
  index,
  expanded,
  onToggle,
  onCopy,
  onFavoriteToggle,
  copiedId,
}: {
  productResult: GeneratedPrompt;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onCopy: (promptId: string, text: string) => void;
  onFavoriteToggle: (
    productName: string,
    platform: string,
    productType: string,
    style: string,
    styleTitle: string,
    prompt: string
  ) => void;
  copiedId: string | null;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm truncate text-left">
              {productResult.productName}
            </p>
            <p className="text-xs text-slate-500 text-left">
              {productResult.prompts.length} prompts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Prompts */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3 border-t border-slate-100 pt-4">
              {productResult.prompts.map((prompt) => {
                const pid = `${productResult.productName}::${prompt.id}`;
                return (
                  <div
                    key={prompt.id}
                    className="bg-slate-50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-6 h-6 rounded-md flex items-center justify-center",
                          isProStyle(prompt.style)
                            ? "bg-emerald-100 text-emerald-600"
                            : prompt.style === "text-enhanced"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-blue-100 text-blue-600"
                        )}>
                          <span className="scale-75">{styleIcons[prompt.style]}</span>
                        </span>
                        <span className="font-medium text-slate-700 text-xs">
                          {prompt.title}
                        </span>
                        {isProStyle(prompt.style) && (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full uppercase tracking-wide">
                            Pro
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onCopy(pid, prompt.prompt)}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                            copiedId === pid
                              ? "bg-green-100 text-green-700"
                              : "bg-white hover:bg-slate-200 text-slate-600 border border-slate-200"
                          )}
                        >
                          {copiedId === pid ? (
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
                        <button
                          onClick={() =>
                            onFavoriteToggle(
                              productResult.productName,
                              productResult.platform,
                              productResult.productType,
                              prompt.style,
                              prompt.title,
                              prompt.prompt
                            )
                          }
                          className="p-1.5 rounded-md transition-all hover:bg-red-50"
                          aria-label="Toggle favorite"
                        >
                          <BatchFavoriteHeart
                            productName={productResult.productName}
                            style={prompt.style}
                          />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-mono line-clamp-3">
                      {prompt.prompt}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Favorite Card Component */
function FavoriteCard({
  item,
  collections,
  expanded,
  onToggle,
  onCopy,
  onDelete,
  onAddTag,
  onRemoveTag,
  onAddToCollection,
  copiedId,
  tagEditId,
  setTagEditId,
  tagInput,
  setTagInput,
}: {
  item: FavoriteItem;
  collections: Collection[];
  expanded: boolean;
  onToggle: () => void;
  onCopy: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onAddTag: (id: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onAddToCollection: (collectionId: string, itemId: string) => void;
  copiedId: string | null;
  tagEditId: string | null;
  setTagEditId: (id: string | null) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
}) {
  const platformLabel =
    platforms.find((p) => p.value === item.platform)?.label ?? item.platform;
  const timeStr = new Date(item.createdAt).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  const availableCollections = collections.filter(
    (col) => !col.itemIds.includes(item.id)
  );

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-slate-900 text-sm truncate">
              {item.productName}
            </p>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {item.styleTitle}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {platformLabel}
            </span>
            <span className="text-[11px] text-slate-400">{timeStr}</span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 border-t border-slate-100 pt-3 space-y-3">
              {/* Prompt Preview */}
              <p className="text-xs text-slate-600 leading-relaxed font-mono line-clamp-4">
                {item.prompt}
              </p>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => onRemoveTag(item.id, tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Tag Input */}
              {tagEditId === item.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onAddTag(item.id);
                      if (e.key === "Escape") setTagEditId(null);
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => onAddTag(item.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setTagEditId(null)}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setTagEditId(item.id)}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  Add tag
                </button>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1">
                  {/* Copy */}
                  <button
                    onClick={() => onCopy(item.id, item.prompt)}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                      copiedId === item.id
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    )}
                  >
                    {copiedId === item.id ? (
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

                  {/* Add to Collection */}
                  {availableCollections.length > 0 && (
                    <div className="relative group">
                      <button className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all">
                        <FolderPlus className="w-3 h-3" />
                        Move
                      </button>
                      <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                        {availableCollections.map((col) => (
                          <button
                            key={col.id}
                            onClick={() => onAddToCollection(col.id, item.id)}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            {col.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => onDelete(item.id)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Batch Favorite Heart (uses hook to read favorites state) */
function BatchFavoriteHeart({
  productName,
  style,
}: {
  productName: string;
  style: string;
}) {
  const [favorites, setFavorites] = useState(() => getFavorites());
  useEffect(() => {
    const interval = setInterval(() => setFavorites(getFavorites()), 500);
    return () => clearInterval(interval);
  }, []);
  const isFav = favorites.some((f) => f.productName === productName && f.style === style);
  return isFav ? (
    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
  ) : (
    <Heart className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
  );
}

/* History Card Component */
function HistoryCard({
  item,
  expanded,
  onToggle,
  onCopy,
  onDelete,
  copiedId,
}: {
  item: HistoryItem;
  expanded: boolean;
  onToggle: () => void;
  onCopy: (historyId: string, promptId: string, text: string) => void;
  onDelete: (id: string) => void;
  copiedId: string | null;
}) {
  const platformLabel =
    platforms.find((p) => p.value === item.platform)?.label ?? item.platform;
  const typeLabel =
    productTypes.find((t) => t.value === item.productType)?.label ??
    item.productType;
  const timeStr = new Date(item.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="min-w-0">
          <p className="font-medium text-slate-900 text-sm truncate">
            {item.productName}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {platformLabel}
            </span>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {typeLabel}
            </span>
            <span className="text-[11px] text-slate-400">{timeStr}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          {item.copiedCount > 0 && (
            <span className="text-[10px] text-slate-400 mr-1">
              {item.copiedCount} copied
            </span>
          )}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Prompts */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-2 border-t border-slate-100 pt-3">
              {item.prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-slate-50 rounded-lg p-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-slate-700 text-xs">
                      {prompt.title}
                    </span>
                    <button
                      onClick={() => onCopy(item.id, prompt.id, prompt.prompt)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                        copiedId === prompt.id
                          ? "bg-green-100 text-green-700"
                          : "bg-white hover:bg-slate-200 text-slate-600 border border-slate-200"
                      )}
                    >
                      {copiedId === prompt.id ? (
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
                  <p className="text-xs text-slate-600 leading-relaxed font-mono line-clamp-3">
                    {prompt.prompt}
                  </p>
                </div>
              ))}

              {/* Delete action */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onDelete(item.id)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
