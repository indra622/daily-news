from fastapi import FastAPI
import httpx
from bs4 import BeautifulSoup

app = FastAPI()

archive_url = "https://newsletter.towardsai.net/archive"

async def fetch_article_links(archive_url):
    async with httpx.AsyncClient() as client:
        response = await client.get(archive_url)
        # print(f'RESPONSE: {response}')
    soup = BeautifulSoup(response.content, 'html.parser')
    article_links = []
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        if href.startswith("https://newsletter.towardsai.net/p/"):
            article_links.append(href)
    return article_links

async def fetch_article_content(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    content = soup.find('div', class_='body markup').get_text(separator=" ").strip()
    return content

@app.get("/api/articles")
async def get_articles():
    article_links = await fetch_article_links(archive_url)
    print(f'LINKS:{article_links}')
    articles = []
    for link in article_links:
        content = await fetch_article_content(link)
        articles.append({
            "url": link,
            "content": content
        })
    return {"articles": articles}
