/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate currency code (ISO 4217)
 */
export function isValidCurrencyCode(code: string): boolean {
  return code.length === 3 && /^[A-Z]{3}$/.test(code);
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitize string for safe display
 */
export function sanitizeString(input: string): string {
  return input.replace(/[<>]/g, '');
}
