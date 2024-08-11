// __tests__/page.test.tsx

beforeAll(() => {
  // Mock the window.open method before tests run
  window.open = jest.fn();
});

afterAll(() => {
  // Clean up and restore the original window.open method after tests run
  window.open.mockRestore();
});

// Your test cases follow

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Article from '../app/components/Article';

describe('Article component', () => {
  const article = {
    title: 'Test Article',
    link: 'https://example.com/test-article',
    summary: 'This is a test summary.'
  };

  it('renders the article title, summary, and link', () => {
    render(<Article title={article.title} link={article.link} summary={article.summary} />);
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('This is a test summary.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read full article' })).toHaveAttribute('href', article.link);
  });

  it('opens ChatGPT with correct prompt on button click', () => {
    render(<Article title={article.title} link={article.link} summary={article.summary} />);
    
    const button = screen.getByText('Summarize with ChatGPT');
    fireEvent.click(button);
    
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://chat.openai.com/chat?prompt='),
      '_blank'
    );
  });
});
