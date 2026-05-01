/**
 * sanitize.ts — strips potentially harmful characters from user input.
 * Used in chat and any other free-text field before display or API calls.
 */

const MAX_INPUT_LENGTH = 500;

/**
 * Removes HTML tags, trims whitespace, and caps length.
 * Does NOT use innerHTML or dangerouslySetInnerHTML — safe by design.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")      // strip HTML tags
    .replace(/[<>]/g, "")         // strip any stray angle brackets
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
}

/** Returns true if the string is safe (non-empty after sanitization) */
export function isSafeInput(input: string): boolean {
  return sanitizeText(input).length > 0;
}
