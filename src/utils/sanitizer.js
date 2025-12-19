/**
 * Extracts the APP ID from a URL or string.
 * Logic: defined by user "text before the first point".
 * 
 * Examples:
 * - "poetarivera.github.io" -> "poetarivera"
 * - "https://myapp.com/page" -> "myapp"
 * - "simple-id" -> "simple-id"
 * 
 * @param {string} input - The raw input (URL or ID).
 * @returns {string} - The extracted ID.
 */
const sanitizeId = (input) => {
    if (!input) return 'unknown_app';

    // 1. Remove protocol if present (http://, https://)
    let clean = input.replace(/(^\w+:|^)\/\//, '');

    // 2. Split by dot and take the first part
    const parts = clean.split('.');

    // 3. If split resulted in empty string (e.g. input was just "."), fallback
    if (parts[0].length === 0 && parts.length > 1) {
        return parts[1] || 'unknown_app';
    }

    // 4. Also remove any remaining slashes if the user passed something like "domain/path" without dots
    // e.g. "localhost:3000" -> "localhost:3000". split('.') -> "localhost:3000". 
    // If we just want "text before first dot", for "localhost" it is "localhost".

    let finalId = parts[0];

    // Final cleanup: remove forward slashes just in case they remained (e.g. "my-app/part")
    // and remove port numbers if they are attached with colon (though usually colon is after domain)
    finalId = finalId.split('/')[0];
    finalId = finalId.split(':')[0]; // remove port if present

    return finalId.toLowerCase(); // Standardize to lowercase
};

module.exports = { sanitizeId };
