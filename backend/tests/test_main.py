import sys
import os
from unittest.mock import patch, AsyncMock
import pytest
from fastapi.testclient import TestClient

# 현재 파일의 디렉토리를 가져와서, backend 디렉토리를 sys.path에 추가
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'backend')))

from main import app, fetch_article_links, fetch_article_content

client = TestClient(app)

@pytest.mark.asyncio
async def test_fetch_article_links():
    mock_html = '''
    <html>
        <body>
            <a href="https://newsletter.towardsai.net/p/article1">Article 1</a>
            <a href="https://newsletter.towardsai.net/p/article2">Article 2</a>
            <a href="https://example.com/other">Not an Article</a>
        </body>
    </html>
    '''
    
    async def mock_get(url):
        mock_response = AsyncMock()
        mock_response.content = mock_html.encode('utf-8')
        return mock_response
    
    with patch('main.httpx.AsyncClient.get', new=mock_get):
        article_links = await fetch_article_links("https://newsletter.towardsai.net/archive")
        
        assert len(article_links) == 2
        assert article_links == [
            "https://newsletter.towardsai.net/p/article1",
            "https://newsletter.towardsai.net/p/article2"
        ]

@pytest.mark.asyncio
async def test_fetch_article_content():
    mock_html = '''
    <html>
        <body>
            <div class="email-content">
                This is the content of the article.
            </div>
        </body>
    </html>
    '''
    
    async def mock_get(url):
        mock_response = AsyncMock()
        mock_response.content = mock_html.encode('utf-8')
        return mock_response
    
    with patch('main.httpx.AsyncClient.get', new=mock_get):
        content = await fetch_article_content("https://newsletter.towardsai.net/p/article1")
        
        assert content.replace('\n', '').strip() == "This is the content of the article."

@pytest.mark.asyncio
async def test_get_articles():
    with patch('main.fetch_article_links', new=AsyncMock()) as mock_fetch_links, \
         patch('main.fetch_article_content', new=AsyncMock()) as mock_fetch_content:
        
        mock_fetch_links.return_value = [
            "https://newsletter.towardsai.net/p/article1",
            "https://newsletter.towardsai.net/p/article2"
        ]
        
        mock_fetch_content.side_effect = [
            "Content of article 1",
            "Content of article 2"
        ]
        
        response = client.get("/api/articles")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data['articles']) == 2
        assert data['articles'][0]['url'] == "https://newsletter.towardsai.net/p/article1"
        assert data['articles'][0]['content'] == "Content of article 1"
        assert data['articles'][1]['url'] == "https://newsletter.towardsai.net/p/article2"
        assert data['articles'][1]['content'] == "Content of article 2"
