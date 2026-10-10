/**
 * Helper to convert standard Arabic digits (0-9) to Eastern Arabic / Indic digits (٠-٩)
 */
export function toArabic(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

/**
 * Format superscript numbers for powers e.g. 5^3 -> ٥³
 */
export function toSuperscriptArabic(power: number | string): string {
  const pStr = String(power);
  const superscripts: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  };
  return pStr.split('').map((ch) => superscripts[ch] || ch).join('');
}

/**
 * Formats points with Arabic digits and star
 */
export function formatScore(score: number): string {
  return `${toArabic(score)} نقطة`;
}

/**
 * Format percentage
 */
export function formatPercentage(part: number, total: number): string {
  if (total === 0) return '٠٪';
  const pct = Math.round((part / total) * 100);
  return `${toArabic(pct)}٪`;
}
