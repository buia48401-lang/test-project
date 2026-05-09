import Script from "next/script";

export function StructuredData() {
  const softwareApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ProductPrompt.ai",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to use",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
    screenshot: {
      "@type": "ImageObject",
      url: "https://productprompt.ai/og-image.png",
    },
    description:
      "Generate professional AI image prompts for your ecommerce products in seconds. Perfect for Amazon, Shopify, Etsy, eBay sellers.",
    url: "https://productprompt.ai",
    author: {
      "@type": "Organization",
      name: "ProductPrompt.ai",
    },
  };

  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is ProductPrompt.ai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ProductPrompt.ai is a free AI-powered tool that generates professional image prompts for ecommerce product photography. It supports platforms like Amazon, Shopify, Etsy, eBay, and works with Midjourney, Flux, ChatGPT Images, and other AI image generators.",
        },
      },
      {
        "@type": "Question",
        name: "Which platforms does ProductPrompt.ai support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ProductPrompt.ai supports all major ecommerce platforms including Amazon, Shopify, Etsy, eBay, and Temu. It also supports general AI image generators like Midjourney, Flux, and ChatGPT Images 2.0.",
        },
      },
      {
        "@type": "Question",
        name: "Is ProductPrompt.ai free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, ProductPrompt.ai is completely free to use. Generate unlimited prompts for your products without any subscription or credit card required.",
        },
      },
      {
        "@type": "Question",
        name: "What styles of product prompts can I generate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ProductPrompt.ai offers 12 professional styles including White Background, Lifestyle Scene, Detail Close-up, Model Wearing, 360° View, Package Unboxing, Comparison, Flat Lay, Macro Texture, Night Scene, Cinematic, and Text Overlay. Each style is optimized for different ecommerce needs.",
        },
      },
      {
        "@type": "Question",
        name: "Can I save and organize my favorite prompts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, ProductPrompt.ai includes a Favorites feature that lets you save prompts, organize them into custom collections, add tags, and quickly access your best prompts anytime.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="software-application-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />
      <Script
        id="faq-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd),
        }}
      />
    </>
  );
}
