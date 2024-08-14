// app/page.tsx
import React from 'react';
import { getArticles } from './lib/getArticles';

export default async function Home() {
  const articles = await getArticles();

  return (
    <div>
      <h1>Articles</h1>
      {articles.length > 0 ? (
        articles.map((article, index) => (
          <div key={index}>
            <h2>Article {index + 1}</h2>
            <p>URL: {article.url}</p>
            <p>Content: {article.content}</p>
          </div>
        ))
      ) : (
        <p>No articles found.</p>
      )}
    </div>
  );
}
