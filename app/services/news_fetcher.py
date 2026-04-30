import os
import httpx
import asyncio

GNEWS_URL = "https://gnews.io/api/v4/search"
TIMEOUT = httpx.Timeout(20.0)  # 20 second timeout for all requests

async def fetch_gnews(query: str):
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            params = {
                "q": query,
                "token": os.getenv("GNEWS_API_KEY"),
                "lang": "en",
                "country": "in",
                "max": 10
            }
            res = await client.get(GNEWS_URL, params=params)
            data = res.json()
            return [
                {
                    "title": a["title"],
                    "url": a["url"],
                    "source": a["source"]["name"],
                    "published": a["publishedAt"]
                }
                for a in data.get("articles", [])
            ]
    except Exception as e:
        print(f"GNews fetch failed for '{query}': {e}")
        return []

async def fetch_serpapi(query: str):
    try:
        url = "https://serpapi.com/search"
        params = {
            "q": query,
            "api_key": os.getenv("SERPAPI_KEY"),
            "engine": "google",
            "num": 10,
            "hl": "en",
            "gl": "in"
        }

        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            res = await client.get(url, params=params)
            data = res.json()

        articles = []
        for r in data.get("organic_results", []):
            articles.append({
                "title": r.get("title"),
                "url": r.get("link"),
                "source": r.get("source", "Unknown"),
                "published": r.get("date")
            })
        return articles
    except Exception as e:
        print(f"SerpAPI fetch failed for '{query}': {e}")
        return []

async def fetch_all_news(queries):
    task_gnews = [fetch_gnews(q) for q in queries]
    task_serpapi = [fetch_serpapi(q) for q in queries]

    results = await asyncio.gather(*task_gnews + task_serpapi, return_exceptions=True)

    articles = []
    for r in results:
        if isinstance(r, list):
            articles.extend(r)
        # silently skip exceptions (already printed inside each fetch)

    return articles
