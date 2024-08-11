from fastapi import FastAPI
import requests
from bs4 import BeautifulSoup

app = FastAPI()

archive_url = "https://newsletter.towardsai.net/archive"

def fetch_article_links(archive_url):
    response = requests.get(archive_url)
    soup = BeautifulSoup(response.content, 'html.parser')
    article_links = []
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        if href.startswith("https://newsletter.towardsai.net/c/"):
            article_links.append(href)
    return article_links

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    content = soup.find('div', class_='email-content').get_text(separator=" ").strip()
    return content

@app.get("/api/articles")
async def get_articles():
    article_links = fetch_article_links(archive_url)
    articles = []
    for link in article_links:
        content = fetch_article_content(link)
        articles.append({
            "url": link,
            "content": content
        })
    return {"articles": articles}
