import json
import re

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from func.crawler import fetch_and_convert
from func.mysql import import_csv_to_mysql, make_json, make_json_type1
from func.data_processor import parse_org_time
from func.redis import save_json_to_redis, get_json_from_redis, get_all_classroom_list, set_cache_ttl

app = FastAPI(
    title="OpenSW API",
    description="강의실 정보 제공 API",
)

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=[
        "https://opensw.ellen24k.kro.kr",
        "https://opensw-dev.ellen24k.kro.kr",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "/docs 에서 API 문서를 확인하세요."}

@app.post(
    "/set-cache-ttl",
    summary="캐시 TTL 값을 설정",
    description="캐시 TTL 값을 초 단위로 설정합니다.",
)
async def set_cache_ttl_endpoint(ttl: int):
    set_cache_ttl(ttl)
    return {"message": f"캐시 TTL 값이 {ttl}초로 설정되었습니다."}

@app.get(
    "/run-crawler",
    summary="크롤러 실행 및 MySQL에 데이터 저장",
    description="주의! 필요할 때만 실행하세요. 30~60초 정도 소요됩니다.",
)
async def run_crawler(background_tasks: BackgroundTasks):
    result = fetch_and_convert()

    #    CSV 파일들을 MySQL에 삽입하는 작업을 백그라운드로 실행
    if isinstance(result, list):  # CSV 파일들이 생성되었으면
        first_insert = True
        for csv_file in result:
            # background_tasks.add_task(import_csv_to_mysql, csv_file, first_insert)
            import_csv_to_mysql(csv_file, first_insert)
            first_insert = False  # 첫 번째 파일 이후에는 first_insert를 False로 설정
        return {"message": "Data fetched and inserted into MySQL."}
    else:
        raise HTTPException(status_code=500, detail=result)


@app.get(
    "/save-to-redis",
    summary="데이터를 Redis에 저장",
    description="주의! 필요할 때만 실행하세요.",
)
async def save_to_redis():
    json_data = make_json()
    json_data_type1 = make_json_type1()

    if json_data:
        data_obj = json.loads(json_data)
        save_json_to_redis('original_data', data_obj)
        print("original_data 저장 완료")
    if json_data_type1:
        data_obj_type1 = json.loads(json_data_type1)

        # org_time 값을 파싱하여 parse_rooms, parse_days, parse_times 추가
        for building in data_obj_type1.values():
            for room in building.values():
                for course in room["courses"]:
                    parsed_time = parse_org_time(course["org_time"])
                    course.update(parsed_time)

        save_json_to_redis('classroom_data', data_obj_type1)
        print("classroom_data 저장 완료")
        return {"message": "데이터가 Redis에 성공적으로 저장되었습니다."}
    else:
        raise HTTPException(status_code=500, detail="Redis에 데이터를 저장하는 중 오류가 발생했습니다.")


@app.get(
    "/make-json",
    summary="전체 데이터를 JSON 형식으로 제공",
    description="MySQL에서 데이터를 가져와 JSON 형식으로 변환합니다.",
)
async def json_data():
    json_data = make_json()
    if json_data:
        return json.loads(json_data)
    else:
        raise HTTPException(status_code=500, detail="JSON 데이터를 생성하는 중 오류가 발생했습니다.")


@app.get(
    "/make-json-type1",
    summary="전체 데이터를 JSON 형식으로 제공 (Type 1)",
    description="MySQL에서 데이터를 가져와 JSON 형식으로 변환합니다.",
)
async def json_data_type1():
    json_data = make_json_type1()
    if json_data:
        return json.loads(json_data)
    else:
        raise HTTPException(status_code=500, detail="JSON 데이터를 생성하는 중 오류가 발생했습니다.")


@app.get(
    "/query-classroom-json/{building}/{classroom_id}",
    summary="특정 강의실 정보 조회. 예) 무용/B105",
    description="JSON 형태",
)
async def query_classroom_json(building: str, classroom_id: str):
    data = get_json_from_redis('classroom_data')
    classroom_id = building+classroom_id

    if not data or building not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building}을(를) 찾을 수 없습니다.")

    if classroom_id not in data[building]:
        raise HTTPException(status_code=404, detail=f"강의실 {classroom_id}을(를) 찾을 수 없습니다.")

    return {
        "classroom": classroom_id,
        "schedule": {
            "time": data[building][classroom_id]["time"],
            "courses": data[building][classroom_id]["courses"]
        }
    }


@app.get(
    "/query-classroom-table/{building}/{classroom_id}",
    summary="특정 강의실 정보 조회. 예) 1공/401-1",
    description="RDB TABLE 형태"
)
async def query_classroom_table(building: str, classroom_id: str):
    data = get_json_from_redis('classroom_data')
    classroom_id = building+classroom_id

    if not data or building not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building}을(를) 찾을 수 없습니다.")

    if (classroom_id) not in data[building]:
        raise HTTPException(status_code=404, detail=f"강의실 {classroom_id}을(를) 찾을 수 없습니다.")

    result = []

    for course in data[building][classroom_id]["courses"]:
        for i in range(len(course["parse_days"])):
            result.append({
                "course_code": course["course_code"],
                "course_name": course["course_name"],
                "org_time": course["org_time"],
                "professor": course["professor"],
                "course_room": course["parse_rooms"][i],
                "day": course["parse_days"][i],
                "start": course["parse_times"][i]["start"],
                "end": course["parse_times"][i]["end"],
            })

    return result


@app.get(
    "/query-building-json/{building_id}",
    summary="특정 건물의 모든 강의실 정보 조회 예) 소프트",
    description="JSON 형태"
)
async def query_building_json(building_id: str):
    data = get_json_from_redis('classroom_data')

    # 데이터 검증
    if not data or building_id not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building_id}을(를) 찾을 수 없습니다.")

    courses = []
    for room in data[building_id].values():
        courses.extend(room['courses'])

    return {
        "building": building_id,
        "courses": courses
    }


@app.get(
    "/query-building-table/{building_id}",
    summary="특정 건물의 모든 강의실 정보 조회 예) 소프트",
    description="RDB TABLE 형태"
)
async def query_building_table(building_id: str):
    data = get_json_from_redis('classroom_data')

    if not data or building_id not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building_id}을(를) 찾을 수 없습니다.")

    result = []

    for room in data[building_id].values():
        for course in room["courses"]:
            for i in range(len(course["parse_days"])):
                result.append({
                    "course_code": course["course_code"],
                    "course_name": course["course_name"],
                    "org_time": course["org_time"],
                    "professor": course["professor"],
                    "course_room": course["parse_rooms"][i],
                    "day": course["parse_days"][i],
                    "start": course["parse_times"][i]["start"],
                    "end": course["parse_times"][i]["end"],
                })

    return result


@app.get(
    "/query-classroom-list",
    summary="모든 강의실 리스트 정보 조회",
    description=""
)
async def query_classroom_list():
    return get_all_classroom_list()


@app.get(
    "/query-classroom-list/{building_id}",
    summary="특정 건물의 모든 강의실 리스트 정보 조회 예) 소프트",
    description=""
)
async def query_classroom_list_in_building(building_id=None):
    classroom_list = get_all_classroom_list()

    def filter_classroom_list(classroom_list, b_id):
        return {classroom for classroom in classroom_list if b_id in classroom}

    classroom_list_in_building = filter_classroom_list(classroom_list, building_id)

    return sorted(classroom_list_in_building)


@app.get(
    "/query-building-list",
    summary="모든 건물 리스트 정보 조회",
    description=""
)
async def query_building_list():
    classroom_list = get_all_classroom_list()
    ret_data = {re.sub(r'B?\d+(-\d+)?$', '', item) for item in classroom_list}
    return sorted(ret_data)

