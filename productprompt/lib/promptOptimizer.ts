import type { OptimizationSuggestion, PromptResult } from "./utils";

interface AnalysisContext {
  platform: string;
  productType: string;
  style: PromptResult["style"];
}

const NEGATIVE_KEYWORDS = [
  "blurry",
  "low quality",
  "amateur",
  "ugly",
  "deformed",
  "pixelated",
  "compressed",
];

const RESOLUTION_PATTERN = /\b(8k|4k|2k|hd|ultra hd|high resolution|high-resolution)\b/i;
const LIGHTING_PATTERN = /\b(lighting|light|lit|illuminat)/i;
const BOKEH_PATTERN = /\b(bokeh|blur|shallow depth of field|depth of field)\b/i;
const ANGLE_PATTERN = /\b(angle|degree|eye-level|overhead|front view|top-down|side view)\b/i;
const QUALITY_PATTERN = /\b(professional|commercial|premium|studio)\b/i;
const TYPOGRAPHY_PATTERN = /\b(typography|text|label|font|caption|headline|callout)\b/i;
const WHITE_BG_PATTERN = /\b(white background|pure white|clean background)\b/i;

function appendModifier(prompt: string, modifier: string): string {
  const trimmed = prompt.trim().replace(/[.,]+$/, "");
  return `${trimmed}, ${modifier}`;
}

function removeNegativeKeyword(prompt: string, keyword: string): string {
  const escaped = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const pattern = new RegExp(`\\s*,?\\s*\\b${escaped}\\b\\s*,?`, "gi");
  return prompt.replace(pattern, ", ").replace(/,\s*,/g, ",").replace(/,\s*$/, "").trim();
}

export function analyzePrompt(
  prompt: string,
  context: AnalysisContext
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  const lower = prompt.toLowerCase();

  if (context.style === "lifestyle" && !BOKEH_PATTERN.test(prompt)) {
    suggestions.push({
      id: "add-bokeh",
      type: "add",
      severity: "high",
      title: "Add bokeh background",
      description:
        "Lifestyle shots feel more cinematic with shallow depth of field. Bokeh blurs the background and pulls focus to the product.",
      apply: (p) => appendModifier(p, "bokeh background, shallow depth of field"),
    });
  }

  if (!RESOLUTION_PATTERN.test(prompt)) {
    suggestions.push({
      id: "add-resolution",
      type: "add",
      severity: "high",
      title: "Specify output resolution",
      description:
        "Naming a resolution (8K) signals to the model that you want crisp, gallery-quality output rather than a quick sketch.",
      apply: (p) => appendModifier(p, "8K resolution"),
    });
  }

  if (!LIGHTING_PATTERN.test(prompt)) {
    suggestions.push({
      id: "add-lighting",
      type: "add",
      severity: "medium",
      title: "Describe the lighting",
      description:
        "Lighting language (soft studio lighting, natural daylight) is one of the strongest levers for photorealism.",
      apply: (p) => appendModifier(p, "soft studio lighting"),
    });
  }

  if (!ANGLE_PATTERN.test(prompt)) {
    suggestions.push({
      id: "add-angle",
      type: "add",
      severity: "low",
      title: "Specify camera angle",
      description:
        "Adding a camera angle (45-degree, eye-level) helps the model produce a consistent composition instead of a random pose.",
      apply: (p) => appendModifier(p, "45-degree angle"),
    });
  }

  if (!QUALITY_PATTERN.test(prompt)) {
    suggestions.push({
      id: "add-quality",
      type: "add",
      severity: "medium",
      title: "Add a quality cue",
      description:
        "Words like \"professional product photography\" or \"commercial quality\" steer the model toward polished marketplace imagery.",
      apply: (p) => appendModifier(p, "professional product photography"),
    });
  }

  for (const keyword of NEGATIVE_KEYWORDS) {
    if (lower.includes(keyword)) {
      suggestions.push({
        id: `remove-${keyword.replace(/\s+/g, "-")}`,
        type: "remove",
        severity: "high",
        title: `Remove "${keyword}"`,
        description: `"${keyword}" is a quality-degrading keyword and will pull the output in the wrong direction.`,
        apply: (p) => removeNegativeKeyword(p, keyword),
      });
    }
  }

  if (context.platform === "amazon" && !WHITE_BG_PATTERN.test(prompt)) {
    suggestions.push({
      id: "platform-amazon-white-bg",
      type: "platform",
      severity: "medium",
      title: "Amazon prefers a white background",
      description:
        "Amazon main listing images require a pure white background. Adding it explicitly increases the chance the prompt produces a usable hero shot.",
      apply: (p) => appendModifier(p, "pure white background"),
    });
  }

  if (
    context.platform === "gpt-image-2" &&
    context.style !== "text-enhanced" &&
    !TYPOGRAPHY_PATTERN.test(prompt)
  ) {
    suggestions.push({
      id: "platform-gpt-typography",
      type: "platform",
      severity: "low",
      title: "Leverage Images 2.0 text rendering",
      description:
        "ChatGPT Images 2.0 renders typography reliably. Adding a small text element (badge, label) often improves marketing-fit.",
      apply: (p) => appendModifier(p, "subtle text label with product name in clean typography"),
    });
  }

  if (prompt.length < 60) {
    suggestions.push({
      id: "restructure-too-short",
      type: "restructure",
      severity: "medium",
      title: "Prompt is short on detail",
      description:
        "Short prompts give the model too much freedom. Add scene, mood, or material details for a more predictable result.",
      apply: (p) => appendModifier(p, "highly detailed, sharp focus, vibrant colors"),
    });
  }

  if (prompt.length > 450) {
    suggestions.push({
      id: "restructure-too-long",
      type: "restructure",
      severity: "low",
      title: "Prompt is approaching the length limit",
      description:
        "Models weight earlier tokens more heavily. Trim trailing modifiers that duplicate earlier intent before you hit the 500-character cap.",
      apply: (p) => p.split(",").slice(0, -2).join(",").trim(),
    });
  }

  const severityRank: Record<OptimizationSuggestion["severity"], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };
  return suggestions.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
}
