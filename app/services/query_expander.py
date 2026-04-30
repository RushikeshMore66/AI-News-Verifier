from groq import Groq
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def extract_json(text: str):
    """Safely extract JSON array from LLM response (handles markdown code fences)."""
    # Strip markdown code fences if present
    text = re.sub(r"```(?:json)?\s*", "", text).strip()
    text = text.rstrip("`").strip()
    # Find the JSON array
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        return json.loads(match.group())
    return [text]  # Fallback: wrap raw text as single query

def expand_query(query: str):
    prompt = f"""
    Expand this news verification query into 5 different search queries.

    Query: {query}

    Return a JSON array of strings only. No explanations, no markdown. Example:
    ["query 1", "query 2", "query 3", "query 4", "query 5"]
    """

    try:
        res = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )
        return extract_json(res.choices[0].message.content)
    except Exception as e:
        print(f"Query expansion failed: {e}")
        return [query]  # Fallback to original query