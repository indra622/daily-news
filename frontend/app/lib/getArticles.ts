// lib/getArticles.js
import { fetchArticles } from './fetchArticles';

export async function getArticles() {
  const json = await fetchArticles();

  // JSON 데이터를 배열로 변환
  const articles = Array.isArray(json.articles) ? json.articles : [];

  return articles;
}
