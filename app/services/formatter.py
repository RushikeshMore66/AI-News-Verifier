import json
import re

def format_output(raw: str):
    try:
        # Strip <think>...</think> reasoning blocks (Nemotron emits these)
        raw = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL).strip()
        # Strip markdown code fences
        raw = re.sub(r"```(?:json)?\s*", "", raw).strip()
        raw = raw.rstrip("`").strip()
        # Find the outermost JSON object
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {"error": "No JSON found in response", "raw": raw}
    except Exception as e:
        return {"error": f"Failed to parse: {e}", "raw": raw}