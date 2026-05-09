import type { StyleType } from "./utils";

export interface ScoreDimension {
  name: string;
  weight: number;
  score: number; // 0-5
  feedback: string;
}

export type ScoreGrade = "excellent" | "good" | "average" | "poor";

export interface PromptScore {
  overall: number; // 0-5, 1 decimal
  dimensions: ScoreDimension[];
  grade: ScoreGrade;
  suggestions: string[];
}

/* ─── keyword lists ─── */

const backgroundKeywords = [
  "background", "scene", "setting", "environment", "backdrop",
  "surface", "table", "desk", "studio", "outdoor", "indoor",
  "context", "lifestyle", "flat lay", "flatlay", "bokeh",
];

const lightingKeywords = [
  "lighting", "light", "illuminated", "soft light", "studio lighting",
  "natural light", "directional light", "ambient", "spotlight",
  "neon", "warm light", "cold light", "dramatic shadows",
  "backlit", "rim light", "golden hour",
];

const qualityKeywords = [
  "high quality", "professional", "8k", "detailed", "ultra sharp",
  "high resolution", "commercial", "premium", "crisp", "sharp",
  "photorealistic", "hyper realistic", "masterpiece", "best quality",
];

const angleKeywords = [
  "angle", "composition", "frame", "perspective", "view",
  "close-up", "close up", "macro", "overhead", "top-down",
  "top down", "45-degree", "45 degree", "eye level", "aerial",
  "side view", "front view", "centered",
];

const photographyTerms = [
  "bokeh", "depth of field", "dof", "macro", "studio lighting",
  "softbox", "diffused", "rim light", "golden hour", "blue hour",
  "hdr", "raw", "prime lens", "wide angle", "telephoto",
  "shallow depth", "f/", "aperture", "iso", "shutter",
  "product photography", "commercial photography", "editorial",
  "fashion photography", "lifestyle photography",
];

const ecommerceTerms = [
  "product photography", "commercial", "ecommerce", "e-commerce",
  "listing", "marketplace", "catalog", "product shot",
];

const platformTerms: Record<string, string[]> = {
  amazon: ["amazon", "fill frame", "white background", "centered", "85%"],
  shopify: ["shopify", "lifestyle", "brand aesthetic", "context"],
  etsy: ["etsy", "handmade", "artisan", "warm", "natural"],
  temu: ["temu", "vibrant", "eye-catching", "bold"],
  ebay: ["ebay", "clear", "detailed", "neutral"],
  "gpt-image-2": ["chatgpt", "images 2.0", "2k", "typography", "text rendering"],
};

const moodWords = [
  "cozy", "luxury", "elegant", "premium", "sophisticated",
  "warm", "inviting", "modern", "minimalist", "chic",
  "glamorous", "rustic", "vintage", "futuristic", "dramatic",
  "serene", "bold", "playful", "romantic", "professional",
];

const detailWords = [
  "texture", "material", "craftsmanship", "weave", "grain",
  "finish", "surface", "detail", "intricate", "precision",
  "stitching", "engraving", "facets", "reflection", "pattern",
];

const cliches = [
  "very good", "really nice", "super cool", "awesome", "amazing",
  "best ever", "must have", "wow factor", "game changer",
  "literally", "just", "stuff", "things", "nice",
];

const casualPatterns = [
  /\b(very|really|super|quite|pretty)\s+(good|nice|cool|great)\b/gi,
  /\b(awesome|amazing|wow|omg)\b/gi,
  /\b(stuff|things|item)\b/gi,
];

/* ─── helpers ─── */

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k.toLowerCase()));
}

function countMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter((k) => lower.includes(k.toLowerCase())).length;
}

function hasCliche(text: string): boolean {
  const lower = text.toLowerCase();
  return cliches.some((c) => lower.includes(c)) || casualPatterns.some((p) => p.test(text));
}

function hasCasualTone(text: string): boolean {
  return casualPatterns.some((p) => p.test(text));
}

/* ─── dimension scorers ─── */

function scoreCompleteness(text: string, productName: string): { score: number; feedback: string; suggestions: string[] } {
  const s: string[] = [];
  let score = 0;

  // product name
  if (text.toLowerCase().includes(productName.toLowerCase())) {
    score += 1;
  } else {
    s.push("Include the product name explicitly in the prompt.");
  }

  // background
  if (containsAny(text, backgroundKeywords)) {
    score += 1;
  } else {
    s.push("Add background or scene description (e.g., 'pure white background' or 'modern desk').");
  }

  // lighting
  if (containsAny(text, lightingKeywords)) {
    score += 1;
  } else {
    s.push("Describe lighting (e.g., 'soft studio lighting' or 'natural daylight').");
  }

  // quality
  if (containsAny(text, qualityKeywords)) {
    score += 1;
  } else {
    s.push("Add quality descriptors (e.g., '8k resolution', 'professional').");
  }

  // angle/composition
  if (containsAny(text, angleKeywords)) {
    score += 1;
  } else {
    s.push("Mention angle or composition (e.g., '45-degree angle', 'centered composition').");
  }

  const feedback = score >= 4
    ? "Excellent completeness — all key elements present."
    : score >= 3
      ? "Good completeness — most elements covered."
      : score >= 2
        ? "Average — missing some important elements."
        : "Poor — many essential elements missing.";

  return { score, feedback, suggestions: s };
}

function scoreProfessionalism(text: string): { score: number; feedback: string; suggestions: string[] } {
  const s: string[] = [];
  let score = 0;

  const photoMatches = countMatches(text, photographyTerms);
  if (photoMatches >= 2) {
    score += 2;
  } else if (photoMatches === 1) {
    score += 1;
    s.push("Add more professional photography terms (e.g., 'bokeh', 'depth of field').");
  } else {
    s.push("Use professional photography terminology (e.g., 'shallow depth of field', 'softbox lighting').");
  }

  if (containsAny(text, ecommerceTerms)) {
    score += 1;
  } else {
    s.push("Include ecommerce photography terms (e.g., 'product photography', 'commercial shot').");
  }

  // platform-specific terms are checked in platform fit, so we give a small bonus here
  const hasPlatformTerm = Object.values(platformTerms).some((terms) => containsAny(text, terms));
  if (hasPlatformTerm) {
    score += 1;
  }

  if (!hasCasualTone(text)) {
    score += 1;
  } else {
    s.push("Avoid casual or colloquial expressions; keep the tone professional.");
  }

  score = Math.min(5, score);

  const feedback = score >= 4
    ? "Highly professional terminology."
    : score >= 3
      ? "Good professionalism with room for more technical terms."
      : score >= 2
        ? "Average — needs more professional language."
        : "Poor — too casual or lacking technical depth.";

  return { score, feedback, suggestions: s };
}

function scorePlatformFit(text: string, platform: string, style: StyleType): { score: number; feedback: string; suggestions: string[] } {
  const s: string[] = [];
  let score = 0;

  const terms = platformTerms[platform] || [];

  // platform keywords
  if (terms.length > 0 && containsAny(text, terms)) {
    score += 2;
  } else if (terms.length > 0) {
    s.push(`Add platform-specific keywords for ${platform} (e.g., ${terms.slice(0, 2).join(", ")}).`);
  } else {
    score += 1; // default platform has no strict requirements
  }

  // composition fit
  const compositionOk = containsAny(text, ["centered", "fill frame", "composition", "framed", "rule of thirds"]);
  if (compositionOk || style === "white" || style === "flatlay") {
    score += 1;
  } else {
    s.push("Ensure composition suits marketplace requirements (centered, fill frame).");
  }

  // style fit
  const styleFit = platform === "amazon" && style === "white"
    ? containsAny(text, ["white background"])
    : platform === "shopify" && containsAny(text, ["lifestyle", "context", "brand"])
      ? true
      : platform === "etsy" && containsAny(text, ["warm", "handmade", "natural"])
        ? true
        : platform === "default" || platform === "gpt-image-2";

  if (styleFit) {
    score += 1;
  } else {
    s.push(`Adjust style to better match ${platform} platform conventions.`);
  }

  // keywords completeness (has at least 3 descriptive adjectives)
  const adjectives = text.match(/\b(professional|premium|elegant|modern|clean|soft|sharp|detailed|high|quality|commercial|lifestyle|natural|studio|pure|white|warm|vibrant|minimalist|luxury|sophisticated|rustic|bold|playful|romantic|dramatic|serene|futuristic|glamorous|chic|inviting)\b/gi);
  if (adjectives && adjectives.length >= 3) {
    score += 1;
  } else {
    s.push("Add more descriptive adjectives to strengthen the prompt.");
  }

  score = Math.min(5, score);

  const feedback = score >= 4
    ? "Excellent platform fit."
    : score >= 3
      ? "Good fit for the target platform."
      : score >= 2
        ? "Average — could better match platform conventions."
        : "Poor — does not meet platform requirements well.";

  return { score, feedback, suggestions: s };
}

function scoreCreativity(text: string, style: StyleType): { score: number; feedback: string; suggestions: string[] } {
  const s: string[] = [];
  let score = 0;

  // unique scene description (not generic white background)
  const hasScene = containsAny(text, [
    "on a", "in a", "at a", "with", "beside", "among", "surrounded",
    "overhead", "top-down", "flat lay", "unboxing", "split screen",
    "turntable", "rotating", "neon-lit", "vintage film", "retro",
  ]);
  if (hasScene || style !== "white") {
    score += 2;
  } else {
    s.push("Add a unique scene or context to make the prompt more distinctive.");
  }

  // mood/atmosphere
  if (containsAny(text, moodWords)) {
    score += 1;
  } else {
    s.push("Include mood or atmosphere words (e.g., 'luxury', 'elegant', 'cozy').");
  }

  // detail description
  if (containsAny(text, detailWords)) {
    score += 1;
  } else {
    s.push("Describe material textures or craftsmanship details.");
  }

  // no cliches
  if (!hasCliche(text)) {
    score += 1;
  } else {
    s.push("Avoid generic or overused phrases; be specific and vivid.");
  }

  score = Math.min(5, score);

  const feedback = score >= 4
    ? "Highly creative and vivid description."
    : score >= 3
      ? "Good creativity with some unique elements."
      : score >= 2
        ? "Average — could be more imaginative."
        : "Poor — generic and lacking creative flair.";

  return { score, feedback, suggestions: s };
}

function scoreLength(text: string): { score: number; feedback: string; suggestions: string[] } {
  const len = text.length;
  const s: string[] = [];
  let score: number;

  if (len >= 150 && len <= 200) {
    score = 5;
  } else if (len > 200 && len <= 300) {
    score = 4;
    s.push("Prompt is slightly long; consider trimming to 150-200 characters for optimal results.");
  } else if (len > 300 && len <= 400) {
    score = 3;
    s.push("Prompt is getting long; aim for 150-200 characters.");
  } else if (len >= 100 && len < 150) {
    score = 2;
    s.push("Prompt is a bit short; add more detail to reach 150-200 characters.");
  } else {
    score = 1;
    if (len < 100) {
      s.push("Prompt is too short. Expand to at least 150 characters with more descriptors.");
    } else {
      s.push("Prompt is too long. Trim to 150-400 characters for best performance.");
    }
  }

  const feedback = score >= 4
    ? "Ideal length."
    : score >= 3
      ? "Acceptable length."
      : score >= 2
        ? "Suboptimal length."
        : "Poor length — needs significant adjustment.";

  return { score, feedback, suggestions: s };
}

function getGrade(overall: number): ScoreGrade {
  if (overall >= 4.5) return "excellent";
  if (overall >= 3.5) return "good";
  if (overall >= 2.5) return "average";
  return "poor";
}

/* ─── public API ─── */

export function scorePrompt(
  text: string,
  productName: string,
  platform: string,
  style: StyleType
): PromptScore {
  const comp = scoreCompleteness(text, productName);
  const prof = scoreProfessionalism(text);
  const plat = scorePlatformFit(text, platform, style);
  const crea = scoreCreativity(text, style);
  const leng = scoreLength(text);

  const dimensions: ScoreDimension[] = [
    { name: "Completeness", weight: 0.25, score: comp.score, feedback: comp.feedback },
    { name: "Professionalism", weight: 0.25, score: prof.score, feedback: prof.feedback },
    { name: "Platform Fit", weight: 0.20, score: plat.score, feedback: plat.feedback },
    { name: "Creativity", weight: 0.15, score: crea.score, feedback: crea.feedback },
    { name: "Length", weight: 0.15, score: leng.score, feedback: leng.feedback },
  ];

  const overall = parseFloat(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0).toFixed(1)
  );

  const allSuggestions = [
    ...comp.suggestions,
    ...prof.suggestions,
    ...plat.suggestions,
    ...crea.suggestions,
    ...leng.suggestions,
  ].slice(0, 5);

  return {
    overall,
    dimensions,
    grade: getGrade(overall),
    suggestions: allSuggestions,
  };
}

/* ─── UI helpers ─── */

export function gradeColor(grade: ScoreGrade): string {
  switch (grade) {
    case "excellent": return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "good": return "text-amber-600 bg-amber-50 border-amber-200";
    case "average": return "text-orange-600 bg-orange-50 border-orange-200";
    case "poor": return "text-rose-600 bg-rose-50 border-rose-200";
    default: return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

export function gradeLabel(grade: ScoreGrade): string {
  switch (grade) {
    case "excellent": return "Excellent";
    case "good": return "Good";
    case "average": return "Average";
    case "poor": return "Poor";
    default: return "Unknown";
  }
}

export function gradeBarColor(grade: ScoreGrade): string {
  switch (grade) {
    case "excellent": return "bg-emerald-500";
    case "good": return "bg-amber-500";
    case "average": return "bg-orange-500";
    case "poor": return "bg-rose-500";
    default: return "bg-slate-400";
  }
}

export function renderStars(score: number): string {
  const full = Math.floor(score);
  const half = score - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}
