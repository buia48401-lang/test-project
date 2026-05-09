import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StructuredData } from "./_components/StructuredData";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://productprompt.ai"),
  title: {
    default: "ProductPrompt.ai - AI Product Photo Prompts for Ecommerce",
    template: "%s | ProductPrompt.ai",
  },
  description:
    "Generate professional AI image prompts for your ecommerce products in seconds. Perfect for Amazon, Shopify, Etsy, eBay sellers. Supports Midjourney, Flux, ChatGPT Images, and more.",
  keywords: [
    "AI product photo prompt",
    "ecommerce photo prompt generator",
    "Midjourney product prompt",
    "Amazon listing image prompt",
    "Shopify product photo AI",
    "Etsy product image prompt",
    "Flux product photography",
    "AI image prompt tool",
    "product photography prompt",
    "ecommerce AI tools",
  ],
  authors: [{ name: "ProductPrompt.ai" }],
  creator: "ProductPrompt.ai",
  publisher: "ProductPrompt.ai",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://productprompt.ai",
    siteName: "ProductPrompt.ai",
    title: "ProductPrompt.ai - AI Product Photo Prompts for Ecommerce",
    description:
      "Generate professional AI image prompts for your ecommerce products in seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ProductPrompt.ai - AI Product Photo Prompt Generator",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@productprompt",
    creator: "@productprompt",
    title: "ProductPrompt.ai - AI Product Photo Prompts",
    description: "Generate professional AI image prompts for your ecommerce products.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#0f172a" },
    ],
  },

  manifest: "/site.webmanifest",

  alternates: {
    canonical: "https://productprompt.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className="font-sans antialiased bg-slate-50">
        {children}
      </body>
    </html>
  );
}
