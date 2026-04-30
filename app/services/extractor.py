import trafilatura
import asyncio

async def extract_content(url: str):
    try:
        downloaded = await asyncio.to_thread(trafilatura.fetch_url, url)
        text = await asyncio.to_thread(trafilatura.extract, downloaded)
        return text or ""
    except:   
        return ""

async def extract_all(articles):
    tasks = [extract_content(a["url"]) for a in articles]
    contents = await asyncio.gather(*tasks)

    for i, a in enumerate(articles):
        a["content"]=contents[i]

    return articles