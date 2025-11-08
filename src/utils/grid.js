/**
 * Calculate grid columns based on number of items (12-column grid system)
 * - 1 item: 12 cols (100%)
 * - 2 items: 6 cols (50%)
 * - 3+ items: 4 cols (33.33%)
 * Max 3 items per row (minimum 4 columns per item)
 */
export function getGridClass(itemCount) {
    if (itemCount === 1) return 'grid-d-12';
    if (itemCount === 2) return 'grid-d-6';
    return 'grid-d-4'; // 3 or more items
}
