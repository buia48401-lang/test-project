import type { GeneratedPrompt } from "./utils";

export interface ExportOptions {
  format: "csv" | "txt";
  data: GeneratedPrompt[] | GeneratedPrompt;
}

function escapeCSV(value: string): string {
  return value.replace(/"/g, '""');
}

function getDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9\-_]/g, "_").toLowerCase();
}

export function exportToCSV(data: GeneratedPrompt[]): string {
  const header = "Product Name,Platform,Type,Style,Prompt";
  const rows: string[] = [];
  for (const item of data) {
    for (const p of item.prompts) {
      rows.push(
        `"${escapeCSV(item.productName)}","${escapeCSV(item.platform)}","${escapeCSV(item.productType)}","${escapeCSV(p.title)}","${escapeCSV(p.prompt)}"`
      );
    }
  }
  return [header, ...rows].join("\n");
}

export function exportToTXT(data: GeneratedPrompt[]): string {
  const sections: string[] = [];
  for (const item of data) {
    const platformLabel = item.platform === "default" ? "All Platforms" : item.platform;
    const typeLabel = item.productType === "default" ? "General" : item.productType;
    sections.push(`=====================================`);
    sections.push(`Product: ${item.productName}`);
    sections.push(`Platform: ${platformLabel}`);
    sections.push(`Type: ${typeLabel}`);
    sections.push(`=====================================`);
    sections.push("");
    for (const p of item.prompts) {
      sections.push(`[${p.title}]`);
      sections.push(p.prompt);
      sections.push("");
    }
  }
  sections.push(`=====================================`);
  return sections.join("\n");
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getExportFilename(
  data: GeneratedPrompt[] | GeneratedPrompt,
  format: "csv" | "txt"
): string {
  const ext = format;
  const date = getDateString();
  if (Array.isArray(data)) {
    if (data.length === 1) {
      const name = sanitizeFilename(data[0].productName);
      return `productprompt_${name}_${date}.${ext}`;
    }
    return `productprompt_batch_${date}_${data.length}products.${ext}`;
  }
  const name = sanitizeFilename(data.productName);
  return `productprompt_${name}_${date}.${ext}`;
}

export function normalizeExportData(
  data: GeneratedPrompt[] | GeneratedPrompt
): GeneratedPrompt[] {
  return Array.isArray(data) ? data : [data];
}
