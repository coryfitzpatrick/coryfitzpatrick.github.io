import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChatbotPage from './chatbot-page';

describe('ChatbotPage', () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders without crashing', () => {
    renderWithRouter(<ChatbotPage />);
  });

  it('displays the welcome message when no messages', () => {
    renderWithRouter(<ChatbotPage />);
    expect(screen.getByText(/Welcome! Ask me anything about Cory's technical skills/i)).toBeInTheDocument();
  });

  it('displays category cards', () => {
    renderWithRouter(<ChatbotPage />);
    expect(screen.getByText('Dev')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Photo')).toBeInTheDocument();
  });

  it('has an input field for user messages', () => {
    renderWithRouter(<ChatbotPage />);
    const input = screen.getByPlaceholderText(/Ask me anything about Cory/i);
    expect(input).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    renderWithRouter(<ChatbotPage />);
    const input = screen.getByPlaceholderText(/Ask me anything about Cory/i);
    fireEvent.change(input, { target: { value: 'What are your skills?' } });
    expect(input.value).toBe('What are your skills?');
  });

  it('has example questions', () => {
    renderWithRouter(<ChatbotPage />);
    expect(screen.getByText(/What are Cory's technical skills?/i)).toBeInTheDocument();
  });

  it('clicking example question populates input', () => {
    renderWithRouter(<ChatbotPage />);
    const exampleButton = screen.getByText(/What are Cory's technical skills?/i);
    fireEvent.click(exampleButton);
    const input = screen.getByPlaceholderText(/Ask me anything about Cory/i);
    expect(input.value).toBe("What are Cory's technical skills?");
  });
});
