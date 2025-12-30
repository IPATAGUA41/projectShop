// ========================================
// Formatters - Utility Functions
// ========================================

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: $)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = '$') {
    return `${currency}${amount.toFixed(2)}`;
}

/**
 * Format a date
 * @param {Date} date - Date to format
 * @param {string} locale - Locale (default: es-ES)
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = 'es-ES') {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(locale, options);
}

/**
 * Format a date with time
 * @param {Date} date - Date to format
 * @param {string} locale - Locale (default: es-ES)
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(date, locale = 'es-ES') {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString(locale, options);
}

/**
 * Format a percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with thousand separators
 * @param {number} value - Value to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
    return value.toLocaleString('es-ES');
}

/**
 * Truncate text to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
