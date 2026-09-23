export interface ParsedLine {
  lineNumber: number;
  text: string;
}

export function parseJDLines(rawText: string): ParsedLine[] {
  if (!rawText) return [];
  const lines = rawText.split(/\r?\n/);
  return lines.map((text, index) => ({
    lineNumber: index + 1,
    text,
  }));
}

export function getStats(text: string) {
  if (!text) return { lines: 0, words: 0, characters: 0 };
  const lines = text.split(/\r?\n/).length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  return { lines, words, characters };
}

export function truncate(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}
