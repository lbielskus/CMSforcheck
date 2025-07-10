// Helper functions for date formatting and handling

/**
 * Formats a date to European format (DD/MM/YYYY)
 */
export function formatDateEuropean(date) {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formats a date to input format (YYYY-MM-DD)
 */
export function formatDateForInput(date) {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toISOString().split('T')[0];
}

/**
 * Gets current date in European format
 */
export function getCurrentDateEuropean() {
  return formatDateEuropean(new Date());
}

/**
 * Gets current date for input field
 */
export function getCurrentDateForInput() {
  return formatDateForInput(new Date());
}

/**
 * Parses European date format (DD/MM/YYYY) to Date object
 */
export function parseEuropeanDate(europeanDate) {
  if (!europeanDate) return null;

  const parts = europeanDate.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

/**
 * Validates European date format
 */
export function isValidEuropeanDate(dateString) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) return false;

  const date = parseEuropeanDate(dateString);
  return date && !isNaN(date.getTime());
}
