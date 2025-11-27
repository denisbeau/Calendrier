// src/utils/dateUtils.js

/**
 * Format a Date object to datetime-local format string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date-time string (YYYY-MM-DDTHH:mm)
 */
function formatDateToLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Get current date-time in datetime-local format
 * @returns {string} Formatted date-time string (YYYY-MM-DDTHH:mm)
 */
export function getCurrentDateTime() {
  return formatDateToLocal(new Date());
}

/**
 * Get date-time one hour from now in datetime-local format
 * @returns {string} Formatted date-time string (YYYY-MM-DDTHH:mm)
 */
export function getOneHourFromNow() {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return formatDateToLocal(now);
}

/**
 * Format a Date object to datetime-local format
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date-time string (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeLocal(date) {
  return formatDateToLocal(new Date(date));
}

