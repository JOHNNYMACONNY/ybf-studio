// utils/input-sanitization.ts
// Input sanitization utility functions for YBF Studio
// Future: Expand to cover XSS, SQL injection, and other input attacks.

export function sanitizeInput(input: string): string {
  // Basic placeholder: Remove script tags
  return input.replace(/<script.*?>.*?<\/script>/gi, '');
}