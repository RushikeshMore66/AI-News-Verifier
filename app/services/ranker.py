import numpy as np
from .embedder import get_embedding

def cosin_sim(a, b):
    a = np.array(a)
    b = np.array(b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return np.dot(a, b) / (norm_a * norm_b)

def semantic_rank(claim, articles):
    claim_vec = get_embedding(claim)

    scored = []
    for a in articles:
        content = a.get("content", "")[:1000] # Use more content for better ranking
        if not content or len(content.strip()) < 10:
            continue

        doc_vec = get_embedding(content)
        score = cosin_sim(claim_vec, doc_vec)

        a["semantic_score"]=float(score)
        scored.append(a)
    
    
    return sorted(scored, key=lambda x:x["semantic_score"], reverse=True)[:8]

TRUSTED_SOURCES = {
    "Reuters": 1,
    "BBC": 1,
    "The Guardian": 1,
    "NDTV": 2,
    "Times of India": 2
}

def get_source_tier(source):
    return TRUSTED_SOURCES.get(source, 3)

def clean_articles(articles):
    seen = set()
    clean = []

    for a in articles:
        if a["url"] in seen:
            continue

        seen.add(a["url"])

        if len(a.get("content", "")) > 200:
            clean.append(a)

    return clean

def apply_scoring(query,articles):
    for a in articles:
        tier = get_source_tier(a.get("source", ""))

        # lower tier = better
        credibility_score = 1 / tier

        a["final_score"] = (
            0.7 * a.get("semantic_score", 0) +
            0.3 * credibility_score
        )

    return sorted(articles, key=lambda x: x["final_score"], reverse=True)

def enforce_diversity(articles):
    seen = {}
    result = []

    for a in articles:
        domain = a["source"]

        if seen.get(domain, 0) >= 2:
            continue

        seen[domain] = seen.get(domain, 0) + 1
        result.append(a)

    return result

def select_best_articles(query, articles):
    articles = semantic_rank(query, articles)
    articles = apply_scoring(query, articles)
    articles = enforce_diversity(articles)
    return articles[:6]