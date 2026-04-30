from groq import AsyncGroq
import os
from dotenv import load_dotenv

load_dotenv()

client = AsyncGroq(
    api_key=os.getenv("GROQ_API_KEY")
)

async def stream_analysis(claim, articles):
    context = "\n\n".join([
        f"{a['source']}: {a['content'][:500]}"
        for a in articles
    ])

    prompt = f"""
You are a professional fact-checking analyst.

Claim:
{claim}

Sources:
{context}

Instructions:
- Identify agreement between sources
- Identify contradictions
- Highlight missing evidence
- Prefer high-credibility sources

Return ONLY a raw JSON object (no markdown, no explanations, no code fences) with exactly these fields:
{{
  "verdict": "TRUE | FALSE | MISLEADING | UNVERIFIED",
  "confidence": <integer 0-100>,
  "summary": "<one paragraph summary>",
  "analysis": "<detailed multi-point analysis>",
  "supporting": [
    {{"source": "...", "url": "...", "snippet": "...", "published": "..."}}
  ],
  "contradicting": [
    {{"source": "...", "url": "...", "snippet": "...", "published": "..."}}
  ]
}}
"""

    stream = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    async for chunk in stream:
        if chunk.choices[0].delta.content:
            yield {
                "type": "token",
                "content": chunk.choices[0].delta.content
            }

    # final signal
    yield {"type": "done"}

    


    

    

    