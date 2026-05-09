import type { StyleType, PromptResult, GeneratedPrompt } from "./utils";

export type { PromptResult, GeneratedPrompt };

const productTypeScenes: Record<string, string[]> = {
  electronics: [
    "modern minimalist desk with laptop and coffee",
    "clean tech workspace with soft ambient lighting",
    "premium unboxing scene with soft shadows",
  ],
  clothing: [
    "flat lay on marble surface with accessories",
    "hanging on wooden rack in boutique setting",
    "folded neatly on linen fabric with natural light",
  ],
  jewelry: [
    "velvet display tray with soft spotlight",
    "on model's hand with blurred garden background",
    "macro on reflective surface with bokeh lights",
  ],
  food: [
    "rustic wooden table with ingredients around",
    "clean ceramic plate with herb garnish",
    "overhead flat lay on slate board",
  ],
  furniture: [
    "modern living room with natural daylight",
    "cozy reading nook with warm lighting",
    "minimalist studio space with plants",
  ],
  beauty: [
    "vanity table with rose petals and mirror",
    "bathroom shelf with soft morning light",
    "spa setting with candles and towels",
  ],
  default: [
    "clean modern surface with soft shadows",
    "lifestyle setting with natural lighting",
    "premium display with elegant background",
  ],
};

const platformModifiers: Record<string, string> = {
  amazon: "Amazon product listing style, centered composition, fill frame 85%",
  shopify: "Shopify product page style, lifestyle context, brand aesthetic",
  etsy: "Etsy handmade style, warm natural light, artisan feel",
  temu: "Temu marketplace style, vibrant colors, eye-catching composition",
  ebay: "eBay listing style, clear detailed view, neutral background",
  "gpt-image-2": "ChatGPT Images 2.0 optimized, 2K resolution, precise text rendering, marketing-ready composition, professional typography",
  default: "ecommerce product photography, commercial quality",
};

function getScene(productType: string, style: string): string {
  const scenes = productTypeScenes[productType] || productTypeScenes.default;
  if (style === "white") return "pure white background, studio lighting";
  if (style === "detail") return scenes[2] || scenes[0];
  return scenes[0];
}

function getProductTypeHints(productType: string): string {
  const hints: Record<string, string> = {
    electronics: "highlighting sleek design, LED indicators, premium materials",
    clothing: "showing texture, fabric drape, stitching details",
    jewelry: "sparkling reflections, luxury feel, intricate details",
    food: "appetizing presentation, fresh ingredients, vibrant colors",
    furniture: "showing scale, craftsmanship, material quality",
    beauty: "elegant packaging, premium feel, soft reflections",
    default: "high quality, professional finish, attention to detail",
  };
  return hints[productType] || hints.default;
}

function getTextEnhancedHints(productType: string): string {
  const hints: Record<string, string> = {
    electronics: "tech specs labels, feature callouts, 'NEW' badge, processor and battery info displayed as clean typography",
    clothing: "brand tag visible, size chart overlay, fabric composition text, care instructions in elegant font",
    jewelry: "price tag with elegant typography, material certificate text, carat weight label, brand engraving visible",
    food: "ingredient list panel, nutritional facts label, brand logo text, 'Organic' or 'Fresh' badge, serving size info",
    furniture: "dimensions annotation, material description text, assembly info label, 'Premium Quality' badge",
    beauty: "ingredients list, usage directions, brand name logo, 'Cruelty-Free' label, volume text in refined typography",
    default: "product name headline, key feature bullet text, price tag, 'Best Seller' badge, clean sans-serif typography",
  };
  return hints[productType] || hints.default;
}

/* Pro-style type hints */
function getModelHints(productType: string): string {
  const hints: Record<string, string> = {
    electronics: "worn as wearable tech accessory, modern styling, contemporary fashion context",
    clothing: "worn by professional model, full body shot, showing fit and silhouette",
    jewelry: "worn by elegant model, close-up portrait, highlighting sparkle against skin",
    food: "held by model in lifestyle context, natural interaction, casual elegance",
    furniture: "model interacting with furniture, showing scale and comfort, lifestyle context",
    beauty: "model applying product, beauty portrait, glowing skin context",
    default: "worn by professional model, full body shot, elegant posing",
  };
  return hints[productType] || hints.default;
}

function get360Hints(productType: string): string {
  const hints: Record<string, string> = {
    electronics: "showing ports, buttons, and screen from all angles, sleek profile visible",
    clothing: "showing front, back, and side views, fabric movement captured, all details visible",
    jewelry: "showing clasp, setting, and stone from every angle, light play on all surfaces",
    food: "showing all sides of packaging, ingredients visible through windows, 360 nutrition view",
    furniture: "showing all sides, joinery details, and dimensions from every perspective",
    beauty: "showing packaging from all angles, bottle design details, label readability",
    default: "all angles visible, complete product showcase, interactive rotation feel",
  };
  return hints[productType] || hints.default;
}

function getPackageHints(productType: string): string {
  const hints: Record<string, string> = {
    electronics: "premium unboxing experience, sleek box with minimal branding, protective foam layers",
    clothing: "branded tissue paper, garment bag, hanger included, boutique packaging feel",
    jewelry: "velvet box interior, ribbon tie, certificate of authenticity, luxury presentation",
    food: "artisan wrapping, ingredient story card, eco-friendly packaging, gourmet presentation",
    furniture: "flat-pack box with assembly illustration, protective corner guards, premium cardboard",
    beauty: "elegant box with gold foil, product nestled in satin, sample sachets included",
    default: "elegant unboxing experience, gift-ready presentation, premium wrapping materials",
  };
  return hints[productType] || hints.default;
}

function getCompareHints(productType: string): string {
  const hints: Record<string, string> = {
    electronics: "before: old device, after: new sleek model, dramatic tech upgrade contrast",
    clothing: "before: wrinkled fabric, after: pristine garment, quality transformation visible",
    jewelry: "before: raw stone, after: polished gem, craftsmanship reveal comparison",
    food: "before: raw ingredients, after: finished dish, culinary transformation split",
    furniture: "before: old worn piece, after: restored/refinished, dramatic restoration contrast",
    beauty: "before: natural skin, after: product applied, visible glow and improvement",
    default: "dramatic before and after transformation, clear visual improvement, split screen layout",
  };
  return hints[productType] || hints.default;
}

function getFlatlayHints(productType: string): string {
  const hints: Record<string, string> = {
    electronics: "arranged with accessories, cables, and manual, tech essentials flat lay",
    clothing: "neatly folded with matching accessories, coordinated outfit layout, style board",
    jewelry: "arranged on marble tray with flowers, delicate composition, romantic styling",
    food: "ingredients artfully arranged, recipe components visible, culinary story told from above",
    furniture: "hardware and fabric swatches arranged, material palette flat lay, design components",
    beauty: "products arranged with flowers and tools, vanity flat lay, self-care ritual display",
    default: "carefully arranged composition, balanced layout, styled overhead view",
  };
  return hints[productType] || hints.default;
}

function getMacroHints(productType: string): string {
  const hints: Record<string, string> = {
    electronics: "circuit board traces, brushed metal texture, button mechanism detail",
    clothing: "fabric weave, thread count visible, stitching precision, material texture",
    jewelry: "stone facets, metal prongs, engraving detail, microscopic craftsmanship",
    food: "crystal sugar, spice texture, water droplets on surface, ingredient micro-detail",
    furniture: "wood grain, joinery detail, fabric weave, finish texture up close",
    beauty: "cream texture, powder particles, brush bristles, product consistency detail",
    default: "microscopic detail visible, texture focus, ultra close-up craftsmanship",
  };
  return hints[productType] || hints.default;
}

function getNightHints(productType: string): string {
  const hints: Record<string, string> = {
    electronics: "device glowing in darkness, screen illumination, futuristic tech ambiance",
    clothing: "night street style, neon reflections on fabric, urban nightlife context",
    jewelry: "sparkling under city lights, nightlife glamour, evening wear elegance",
    food: "night market ambiance, warm lantern light, evening dining atmosphere",
    furniture: "ambient room lighting, cozy evening setup, mood lighting design",
    beauty: "evening glamour look, nightlife makeup, city lights reflection",
    default: "neon lighting effects, dramatic shadows, futuristic night atmosphere",
  };
  return hints[productType] || hints.default;
}

function getVintageHints(productType: string): string {
  const hints: Record<string, string> = {
    electronics: "retro tech aesthetic, analog dials, vintage gadget feel, 80s technology vibe",
    clothing: "retro fashion editorial, vintage boutique setting, classic style era",
    jewelry: "heirloom aesthetic, antique setting, vintage glamour, estate jewelry feel",
    food: "vintage cookbook style, rustic farmhouse table, nostalgic family recipe feel",
    furniture: "mid-century modern setting, retro living room, classic design era",
    beauty: "vintage vanity setup, old Hollywood glamour, classic beauty ritual",
    default: "retro color grading, nostalgic atmosphere, warm analog film tones",
  };
  return hints[productType] || hints.default;
}

export function generatePrompts(
  productName: string,
  platform: string = "default",
  productType: string = "default",
  selectedStyles?: StyleType[]
): GeneratedPrompt {
  const platformMod = platformModifiers[platform] || platformModifiers.default;
  const typeHints = getProductTypeHints(productType);

  const allPrompts: PromptResult[] = [
    {
      id: "white",
      title: "White Background",
      style: "white",
      icon: "Square",
      prompt: `Professional product photography of ${productName}, pure white background, soft studio lighting, 45-degree angle, ${typeHints}, highly detailed, 8k resolution, commercial photography, ${platformMod}`,
    },
    {
      id: "lifestyle",
      title: "Lifestyle Scene",
      style: "lifestyle",
      icon: "Image",
      prompt: `${productName} on ${getScene(
        productType,
        "lifestyle"
      )}, natural lighting, lifestyle product photography, cozy aesthetic, shallow depth of field, bokeh background, 8k resolution, ${platformMod}`,
    },
    {
      id: "detail",
      title: "Detail Close-up",
      style: "detail",
      icon: "ZoomIn",
      prompt: `Close-up macro shot of ${productName}, ${getScene(
        productType,
        "detail"
      )}, highlighting ${typeHints}, soft directional lighting, professional product detail photography, 8k resolution, ultra sharp`,
    },
  ];

  if (platform === "gpt-image-2") {
    const textHints = getTextEnhancedHints(productType);
    allPrompts.push({
      id: "text-enhanced",
      title: "Text-Enhanced",
      style: "text-enhanced",
      icon: "Type",
      prompt: `Product photography of ${productName} with clear text labels showing key features and benefits, professional typography overlay, clean minimalist design, marketing poster style, 2K resolution, highly readable text, brand-friendly layout, ${textHints}, ${platformMod}`,
    });
  }

  /* Pro styles */
  const proPrompts: PromptResult[] = [
    {
      id: "model",
      title: "Model Shot",
      style: "model",
      icon: "User",
      prompt: `Professional fashion photography of ${productName}, ${getModelHints(productType)}, studio lighting, clean background, high-end fashion editorial style, 8k resolution, ${platformMod}`,
    },
    {
      id: "360",
      title: "360° View",
      style: "360",
      icon: "RotateCw",
      prompt: `360 degree product view of ${productName}, rotating display on turntable, ${get360Hints(productType)}, clean studio environment, interactive product showcase, 8k resolution, ${platformMod}`,
    },
    {
      id: "package",
      title: "Packaging",
      style: "package",
      icon: "Package",
      prompt: `Premium packaging photography of ${productName}, elegant unboxing experience, gift-ready presentation, ${getPackageHints(productType)}, luxury wrapping, soft lighting, 8k resolution, ${platformMod}`,
    },
    {
      id: "compare",
      title: "Comparison",
      style: "compare",
      icon: "GitCompare",
      prompt: `Before and after comparison of ${productName}, split screen composition, dramatic transformation, ${getCompareHints(productType)}, clear visual contrast, professional comparison layout, 8k resolution, ${platformMod}`,
    },
    {
      id: "flatlay",
      title: "Flat Lay",
      style: "flatlay",
      icon: "LayoutGrid",
      prompt: `Flat lay photography of ${productName}, top-down view, carefully arranged composition, ${getFlatlayHints(productType)}, clean background, overhead perspective, 8k resolution, ${platformMod}`,
    },
    {
      id: "macro",
      title: "Macro Shot",
      style: "macro",
      icon: "Microscope",
      prompt: `Extreme macro photography of ${productName}, microscopic detail visible, texture focus, ${getMacroHints(productType)}, specialized macro lens, ultra close-up, 8k resolution, ${platformMod}`,
    },
    {
      id: "night",
      title: "Night Scene",
      style: "night",
      icon: "Moon",
      prompt: `Night scene product photography of ${productName}, neon lighting effects, cyberpunk aesthetic, ${getNightHints(productType)}, dramatic shadows, futuristic atmosphere, 8k resolution, ${platformMod}`,
    },
    {
      id: "vintage",
      title: "Vintage",
      style: "vintage",
      icon: "Film",
      prompt: `Vintage film photography of ${productName}, retro color grading, nostalgic atmosphere, ${getVintageHints(productType)}, analog film look, warm tones, 8k resolution, ${platformMod}`,
    },
  ];

  let prompts: PromptResult[];
  if (selectedStyles && selectedStyles.length > 0) {
    const baseMap = new Map(allPrompts.map((p) => [p.style, p]));
    const proMap = new Map(proPrompts.map((p) => [p.style, p]));
    prompts = selectedStyles
      .map((s) => baseMap.get(s) ?? proMap.get(s))
      .filter((p): p is PromptResult => !!p);
    if (prompts.length === 0) {
      prompts = allPrompts;
    }
  } else {
    prompts = allPrompts;
  }

  return {
    productName,
    platform,
    productType,
    prompts,
  };
}
