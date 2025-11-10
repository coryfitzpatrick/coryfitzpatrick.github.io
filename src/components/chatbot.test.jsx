import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chatbot from './chatbot';

// Mock the analytics utility
jest.mock('../utils/analytics', () => ({
    trackEvent: jest.fn()
}));

// Mock the logger utility
jest.mock('../utils/logger', () => ({
    logger: {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn()
    }
}));

describe('Chatbot', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Mock fetch globally
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders without crashing', () => {
        render(<Chatbot />);
        expect(screen.getByRole('region', { name: /interactive chatbot/i })).toBeInTheDocument();
    });

    it('displays welcome message when no messages', () => {
        render(<Chatbot />);
        expect(screen.getByText(/ask me anything about cory/i)).toBeInTheDocument();
    });

    it('displays example questions', () => {
        render(<Chatbot />);
        const exampleButtons = screen.getAllByRole('button', { name: /ask:/i });
        expect(exampleButtons.length).toBeGreaterThan(0);
    });

    it('has accessible form with label', () => {
        render(<Chatbot />);
        expect(screen.getByLabelText(/chat message input/i)).toBeInTheDocument();
    });

    it('has submit button', () => {
        render(<Chatbot />);
        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('has voice input button', () => {
        render(<Chatbot />);
        expect(screen.getByRole('button', { name: /start voice input/i })).toBeInTheDocument();
    });

    it('submit button is disabled when input is empty', () => {
        render(<Chatbot />);
        const submitButton = screen.getByRole('button', { name: /send message/i });
        expect(submitButton).toBeDisabled();
    });

    it('submit button is enabled when input has text', () => {
        render(<Chatbot />);
        const input = screen.getByLabelText(/chat message input/i);
        const submitButton = screen.getByRole('button', { name: /send message/i });

        fireEvent.change(input, { target: { value: 'test message' } });
        expect(submitButton).not.toBeDisabled();
    });

    it('clears input after form submission', async () => {
        // Mock successful fetch
        global.fetch.mockResolvedValue({
            ok: true,
            body: {
                getReader: () => ({
                    read: jest.fn()
                        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('Response') })
                        .mockResolvedValueOnce({ done: true })
                })
            }
        });

        render(<Chatbot />);
        const input = screen.getByLabelText(/chat message input/i);
        const form = input.closest('form');

        fireEvent.change(input, { target: { value: 'test message' } });
        fireEvent.submit(form);

        await waitFor(() => {
            expect(input.value).toBe('');
        });
    });

    it('has fullscreen toggle button', () => {
        render(<Chatbot />);
        expect(screen.getByRole('button', { name: /enter fullscreen/i })).toBeInTheDocument();
    });

    it('toggles fullscreen when button is clicked', () => {
        render(<Chatbot />);
        const toggleButton = screen.getByRole('button', { name: /enter fullscreen/i });

        fireEvent.click(toggleButton);
        expect(screen.getByRole('button', { name: /exit fullscreen/i })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /exit fullscreen/i }));
        expect(screen.getByRole('button', { name: /enter fullscreen/i })).toBeInTheDocument();
    });

    it('has proper ARIA attributes for accessibility', () => {
        render(<Chatbot />);

        // Check for main region
        expect(screen.getByRole('region', { name: /interactive chatbot/i })).toBeInTheDocument();

        // Check for log region (messages area)
        const messagesArea = screen.getByRole('log');
        expect(messagesArea).toHaveAttribute('aria-live', 'polite');
    });

    it('input field has proper accessibility attributes', () => {
        render(<Chatbot />);
        const input = screen.getByLabelText(/chat message input/i);

        expect(input).toHaveAttribute('aria-label', 'Chat message input');
        expect(input).toHaveAttribute('placeholder');
    });

    it('buttons have proper aria-labels', () => {
        render(<Chatbot />);

        expect(screen.getByRole('button', { name: /send message/i })).toHaveAttribute('aria-label');
        expect(screen.getByRole('button', { name: /start voice input/i })).toHaveAttribute('aria-label');
        expect(screen.getByRole('button', { name: /enter fullscreen/i })).toHaveAttribute('aria-label');
    });

    it('voice input button has aria-pressed attribute', () => {
        render(<Chatbot />);
        const voiceButton = screen.getByRole('button', { name: /start voice input/i });

        expect(voiceButton).toHaveAttribute('aria-pressed', 'false');
    });
});
