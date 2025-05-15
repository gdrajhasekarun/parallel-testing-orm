from cachetools import TTLCache
from exceptiongroup import catch

cache_container = TTLCache(maxsize=100, ttl=600)

def get_cache_value(key:str):
    try:
        return cache_container.get(key)
    except Exception as e:
        return ""

def put_value_to_cache(key, value):
    cache_container[key] = value