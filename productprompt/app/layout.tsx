import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProductPrompt.ai - AI Product Photo Prompts in Seconds",
  description: "Generate professional prompts for Midjourney, Flux & more. Perfect for Amazon, Shopify, Etsy sellers.",
  keywords: "AI product photo prompt, ecommerce photo prompt, Midjourney product prompt, Amazon listing image prompt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50">
        {children}
      </body>
    </html>
  );
}
