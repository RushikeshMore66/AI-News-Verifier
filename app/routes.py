from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json

from app.services.query_expander import expand_query
from app.services.news_fetcher import fetch_all_news
from app.services.extractor import extract_all
from app.services.ranker import clean_articles, select_best_articles
from app.services.reasoner import stream_analysis  # NEW

router = APIRouter()

@router.post("/verify-stream")
async def verify_stream(payload: dict):
    query = payload.get("query")

    async def event_generator():
        # 1. Expand
        queries = expand_query(query)

        # 2. Fetch
        articles = await fetch_all_news(queries)

        # 3. Extract
        articles = await extract_all(articles)

        # 4. Clean + Rank
        articles = clean_articles(articles)
        articles = select_best_articles(query, articles)

        # 5. Stream LLM output
        async for chunk in stream_analysis(query, articles):
            yield f"data: {json.dumps(chunk)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")