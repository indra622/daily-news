// lib/fetchArticles.ts

export const fetchArticles = async () => {
    try {
      const response = await fetch('http://backend:8000/api/articles', {
        cache: 'no-store', // 항상 최신 데이터를 가져오기 위해 캐시 비활성화
      });
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  };
  