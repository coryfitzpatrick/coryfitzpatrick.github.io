import { toKebabCase } from './string';

describe('toKebabCase', () => {
    it('converts simple string to kebab-case', () => {
        expect(toKebabCase('Hello World')).toBe('hello-world');
    });

    it('handles multiple spaces', () => {
        expect(toKebabCase('Hello   World')).toBe('hello-world');
    });

    it('handles special characters', () => {
        expect(toKebabCase('J&J')).toBe('j-j');
        expect(toKebabCase('Marsh & McLennan Agency')).toBe('marsh-mclennan-agency');
    });

    it('handles already kebab-case strings', () => {
        expect(toKebabCase('hello-world')).toBe('hello-world');
    });

    it('handles empty string', () => {
        expect(toKebabCase('')).toBe('');
    });

    it('removes leading/trailing spaces', () => {
        expect(toKebabCase('  Hello World  ')).toBe('hello-world');
    });

    it('handles single word', () => {
        expect(toKebabCase('Hello')).toBe('hello');
    });

    it('handles numbers', () => {
        expect(toKebabCase('Project 2024')).toBe('project-2024');
    });
});
