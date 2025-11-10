import { getGridClass } from './grid';

describe('getGridClass', () => {
    it('returns grid-d-12 for 1 item', () => {
        expect(getGridClass(1)).toBe('grid-d-12');
    });

    it('returns grid-d-6 for 2 items', () => {
        expect(getGridClass(2)).toBe('grid-d-6');
    });

    it('returns grid-d-4 for 3+ items', () => {
        expect(getGridClass(3)).toBe('grid-d-4');
        expect(getGridClass(4)).toBe('grid-d-4');
        expect(getGridClass(10)).toBe('grid-d-4');
        expect(getGridClass(100)).toBe('grid-d-4');
    });

    it('returns grid-d-4 for 0 items', () => {
        expect(getGridClass(0)).toBe('grid-d-4');
    });

    it('handles negative numbers gracefully', () => {
        expect(getGridClass(-1)).toBe('grid-d-4');
        expect(getGridClass(-10)).toBe('grid-d-4');
    });
});
