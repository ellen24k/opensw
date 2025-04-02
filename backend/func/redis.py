import os
import time
import re
import redis

# Redis 클라이언트 설정
client = redis.StrictRedis(host='172.22.22.23', port=6379, decode_responses=True)

# 캐시 저장소
_cache = {}
_cache_expiry = {}
DEFAULT_CACHE_TTL = 60 * 60 * 3  # 기본 캐시 유효시간 (초). 크롤링 데이터 업데이트 시간에 따라.


# JSON 데이터 저장
def save_json_to_redis(key, json_data):
    invalidate_cache()
    client.json().set(key, '$', json_data)
    # 캐시 업데이트
    _cache[key] = json_data
    _cache_expiry[key] = time.time() + DEFAULT_CACHE_TTL
    print(f"JSON 데이터가 Redis에 저장되었습니다: {key}")

    # JSON 데이터를 로컬 파일로 저장
    with open('custom.json', 'w', encoding='utf-8') as f:
        import json
        json.dump(json_data, f, ensure_ascii=False, indent=4)
    print(f"JSON 데이터가 로컬 파일에 저장되었습니다: custom.json")


def get_json_from_redis(key, ttl=DEFAULT_CACHE_TTL):
    start_time = time.time()
    cache_hit = False
    data_size = 0

    # 캐시에 데이터가 있고 유효한지 확인
    current_time = time.time()
    if key in _cache and key in _cache_expiry and current_time < _cache_expiry[key]:
        data = _cache[key]
        cache_hit = True
    else:
        # 캐시에 없거나 만료된 경우 Redis에서 조회
        data = client.json().get(key)
        if data:
            # 데이터 용량 계산 (바이트 단위)
            import sys
            import json
            data_size = sys.getsizeof(json.dumps(data))

            # 데이터 캐싱
            _cache[key] = data
            _cache_expiry[key] = current_time + ttl

    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # 밀리초 단위로 변환

    # 결과 출력
    cache_status = "HIT" if cache_hit else "MISS"
    print(f"쿼리: {key} | 캐시: {cache_status} | 시간: {execution_time:.2f}ms")

    if cache_hit:
        print(f"캐시에서 데이터 조회: {key}")
    elif data:
        print(f"Redis에서 데이터 조회 및 캐싱: {key} | 데이터 크기: {data_size / 1024:.2f}KB")

    return data


# 강제로 캐시 무효화 (필요한 경우)
def invalidate_cache(key=None):
    if key:
        if key in _cache:
            del _cache[key]
        if key in _cache_expiry:
            del _cache_expiry[key]
        print(f"캐시 무효화: {key}")
    else:
        _cache.clear()
        _cache_expiry.clear()
        print("모든 캐시 무효화")

def get_all_classroom_list():
    data = set(client.json().get('classroom_data', os.getenv('RDS_GET_ALL_CLASSROOM_LIST')))

    if data:
        return sorted(data)
    else:
        return None
