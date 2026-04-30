import json
from redis import Redis

# In-memory fallback cache
_memory_cache = {}
_use_redis = False

try:
    r = Redis(host="localhost", port=6379, decode_responses=True, socket_connect_timeout=1)
    # Test connection
    r.ping()
    _use_redis = True
except Exception:
    # Silently fallback without printing scary errors unless needed
    r = None

def get_cache(key: str):
    if _use_redis and r:
        try:
            data = r.get(f"verify:{key}")
            return json.loads(data) if data else None
        except Exception:
            pass
    
    # Fallback
    return _memory_cache.get(key)

def set_cache(key: str, value: str, ttl: int = 3600):
    if _use_redis and r:
        try:
            r.setex(f"verify:{key}", ttl, json.dumps(value))
            return
        except Exception:
            pass
            
    # Fallback
    _memory_cache[key] = value