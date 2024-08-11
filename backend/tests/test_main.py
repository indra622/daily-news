import sys
import os
from unittest.mock import patch
from fastapi.testclient import TestClient

# 현재 파일의 디렉토리를 가져와서, backend 디렉토리를 sys.path에 추가
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'backend')))

from main import app, fetch_article_links, fetch_article_content

client = TestClient(app)

def test_fetch_article_links():
    mock_html = '''
    <html>
        <body>
            <a href="https://newsletter.towardsai.net/c/article1">Article 1</a>
            <a href="https://newsletter.towardsai.net/c/article2">Article 2</a>
            <a href="https://example.com/other">Not an Article</a>
        </body>
    </html>
    '''
    
    with patch('main.requests.get') as mock_get:
        mock_get.return_value.content = mock_html.encode('utf-8')
        article_links = fetch_article_links("https://newsletter.towardsai.net/archive")
        
        assert len(article_links) == 2
        assert article_links == [
            "https://newsletter.towardsai.net/p/article1",
            "https://newsletter.towardsai.net/p/article2"
        ]

def test_fetch_article_content():
    mock_html = '''
    <html>
        <body>
            <div class="body markup">
                <p>This is the content of the article.</p>
            </div>
        </body>
    </html>
    '''
    
    with patch('main.requests.get') as mock_get:
        mock_get.return_value.content = mock_html.encode('utf-8')
        content = fetch_article_content("https://newsletter.towardsai.net/p/article1")
        
        # 모든 줄바꿈 제거 후 비교
        assert content.replace('\n', '').strip() == "This is the content of the article."



def test_get_articles():
    with patch('main.fetch_article_links') as mock_fetch_links, \
         patch('main.fetch_article_content') as mock_fetch_content:
        
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
