import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutPage from './about-page';

/* global describe, test, expect */

describe('AboutPage Component', () => {
  test('renders about page heading', () => {
    render(<AboutPage />);

    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('renders about page content', () => {
    render(<AboutPage />);

    expect(screen.getByText(/Cory Fitzpatrick is a seasoned Software Tech Lead/)).toBeInTheDocument();
    expect(screen.getByText(/proven track record of guiding engineering teams/)).toBeInTheDocument();
    expect(screen.getByText(/successfully driven the delivery of MVPs/)).toBeInTheDocument();
    expect(screen.getByText(/dedication to mentorship/)).toBeInTheDocument();
  });

  test('renders technology stack information', () => {
    render(<AboutPage />);

    expect(screen.getByText(/This site was built with/)).toBeInTheDocument();
  });

  test('renders external links', () => {
    // Arrange & Act
    render(<AboutPage />);

    // Assert
    const githubLink = screen.getByRole('link', { name: /Check out this site's React code on GitHub/i });
    const linkedinLink = screen.getByRole('link', { name: /LinkedIn/i });

    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();

    expect(githubLink).toHaveAttribute('href', 'https://github.com/coryfitzpatrick/coryfitzpatrick.github.io');
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/coryfitzpatrick');
  });

  test('external links have correct attributes', () => {
    render(<AboutPage />);

    const externalLinks = screen.getAllByRole('link');

    externalLinks.forEach(link => {
      if (link.getAttribute('href')?.startsWith('http')) {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  test('renders technology links', () => {
    render(<AboutPage />);

    expect(screen.getByText('React 19')).toBeInTheDocument();
    expect(screen.getByText('React Router')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
    expect(screen.getByText('SCSS')).toBeInTheDocument();
    expect(screen.getByText('RWDGRID')).toBeInTheDocument();
    expect(screen.getByText('GitHub Pages')).toBeInTheDocument();
  });

  test('has correct container structure', () => {
    const { container } = render(<AboutPage />);

    expect(container.querySelector('#sub-content')).toBeInTheDocument();
    expect(container.querySelector('.about')).toBeInTheDocument();
    expect(container.querySelector('.grid-d-12')).toBeInTheDocument();
  });

  test('renders all paragraphs', () => {
    render(<AboutPage />);

    const paragraphs = screen.getAllByText(/Cory|This site/);
    expect(paragraphs.length).toBeGreaterThan(0);
  });
});