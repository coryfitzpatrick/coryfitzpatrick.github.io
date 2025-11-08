import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './home-page';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('HomePage', () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders without crashing', () => {
    renderWithRouter(<HomePage />);
  });

  it('displays the welcome message when no messages', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText(/Welcome! Ask me anything about Cory's technical skills/i)).toBeInTheDocument();
  });

  it('displays category cards', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Dev')).toBeInTheDocument();
  });

  it('has an input field for user messages', () => {
    renderWithRouter(<HomePage />);
    const input = screen.getByPlaceholderText(/Ask me about Cory/i);
    expect(input).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    renderWithRouter(<HomePage />);
    const input = screen.getByPlaceholderText(/Ask me about Cory/i);
    fireEvent.change(input, { target: { value: 'What are your skills?' } });
    expect(input.value).toBe('What are your skills?');
  });

  it('has example questions', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText(/What are Cory's technical skills?/i)).toBeInTheDocument();
  });

  it('clicking example question populates input and triggers submit', async () => {
    // Mock fetch to prevent actual API calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        body: {
          getReader: () => ({
            read: () => Promise.resolve({ done: true, value: null })
          })
        }
      })
    );

    const { container } = renderWithRouter(<HomePage />);
    const exampleButton = screen.getByText(/What are Cory's technical skills?/i);

    fireEvent.click(exampleButton);

    await waitFor(() => {
      const messages = container.querySelectorAll('.message');
      expect(messages.length).toBeGreaterThan(0);
    });

    global.fetch.mockClear();
  });

  it('renders fullscreen toggle button', () => {
    renderWithRouter(<HomePage />);
    const toggleButton = screen.getByRole('button', { name: /Enter fullscreen/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('displays expand icon when not in fullscreen', () => {
    renderWithRouter(<HomePage />);
    const toggleButton = screen.getByRole('button', { name: /Enter fullscreen/i });
    expect(toggleButton).toHaveTextContent('⛶');
  });

  it('toggles fullscreen mode when clicking button', () => {
    const { container } = renderWithRouter(<HomePage />);
    const toggleButton = screen.getByRole('button', { name: /Enter fullscreen/i });
    const chatContainer = container.querySelector('.chat-container');

    expect(chatContainer).not.toHaveClass('fullscreen');

    fireEvent.click(toggleButton);
    expect(chatContainer).toHaveClass('fullscreen');

    fireEvent.click(toggleButton);
    expect(chatContainer).not.toHaveClass('fullscreen');
  });

  it('changes button icon when entering fullscreen', () => {
    renderWithRouter(<HomePage />);
    const toggleButton = screen.getByRole('button', { name: /Enter fullscreen/i });

    expect(toggleButton).toHaveTextContent('⛶');

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('✕');
    expect(toggleButton).toHaveAttribute('aria-label', 'Exit fullscreen');
  });

  it('hides header when in fullscreen mode', () => {
    const { container } = renderWithRouter(<HomePage />);
    const toggleButton = screen.getByRole('button', { name: /Enter fullscreen/i });

    expect(screen.getByText(/Ask me about Cory's skills and experience/i)).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByText(/Ask me about Cory's skills and experience/i)).not.toBeInTheDocument();
  });

  it('maintains chat messages when toggling fullscreen', () => {
    const { container } = renderWithRouter(<HomePage />);
    const toggleButton = screen.getByRole('button', { name: /Enter fullscreen/i });

    expect(screen.getByText(/Welcome! Ask me anything about Cory's technical skills/i)).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText(/Welcome! Ask me anything about Cory's technical skills/i)).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText(/Welcome! Ask me anything about Cory's technical skills/i)).toBeInTheDocument();
  });
});
