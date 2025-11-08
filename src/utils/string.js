/**
 * Convert a string to kebab-case
 * Example: "Portfolio Chatbot Backend" → "portfolio-chatbot-backend"
 */
export function toKebabCase(str) {
    return str
        .toLowerCase()
        .split(/[^a-z0-9]+/)  // Split on non-alphanumeric characters
        .filter(part => part) // Remove empty strings
        .join('-');           // Join with dashes
}
