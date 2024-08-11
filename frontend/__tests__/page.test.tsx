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
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '../app/page';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      articles: [
        { title: 'Article 1', link: 'https://example.com/article1', summary: 'Summary 1' },
        { title: 'Article 2', link: 'https://example.com/article2', summary: 'Summary 2' }
      ]
    }),
  })
) as jest.Mock;

describe('Home page', () => {
  it('renders articles after fetching data', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument();
      expect(screen.getByText('Article 2')).toBeInTheDocument();
    });
  });

  it('allows selecting articles and generating summary', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    const button = screen.getByText('Generate Daily Summary');
    fireEvent.click(button);

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://chat.openai.com/chat?prompt='),
      '_blank'
    );
  });
});
