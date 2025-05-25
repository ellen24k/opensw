import json
import os
import re
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, HTTPException, BackgroundTasks, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from func.crawler import fetch_and_convert
from func.data_processor import parse_org_time
from func.mysql import import_csv_to_mysql, make_json, make_json_type1
from func.redis import save_json_to_redis, get_json_from_redis, get_all_classroom_list, set_cache_ttl

is_production = os.getenv("MODE") == "production"
app = FastAPI(
    title="OpenSW API",
    description="강의실 정보 제공 API",
    docs_url=None if is_production else "/docs",
    redoc_url=None if is_production else "/redoc",
)

# CORS 미들웨어 추가
if is_production:
    app.add_middleware(
        CORSMiddleware,  # type: ignore
        allow_origins=[
            "https://opensw.ellen24k.kro.kr",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,  # type: ignore
        allow_origins=[
            "https://opensw-dev.ellen24k.kro.kr",
        ],
        allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",  # for local
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

security = HTTPBearer()


def verify_api_key(credentials: HTTPAuthorizationCredentials):
    expected_api_key = os.environ.get("CRAWLER_API_KEY")

    if not expected_api_key:
        raise HTTPException(status_code=500, detail="서버 설정 오류: API 키가 설정되지 않았습니다.")

    if credentials.credentials != expected_api_key:
        raise HTTPException(status_code=401, detail="인증에 실패했습니다. 유효한 API 키가 필요합니다.")


@app.get("/")
async def root():
    return {"message": "/docs, /redoc 에서 API 문서를 확인하세요."}


@app.post(
    "/set-cache-ttl",
    summary="캐시 TTL 값을 ms단위로 설정합니다.",
    description="",
)
async def set_cache_ttl_endpoint(ttl: int, credentials: HTTPAuthorizationCredentials = Security(security)):
    verify_api_key(credentials)

    set_cache_ttl(ttl)
    return {"message": f"캐시 TTL 값이 {ttl}ms로 설정되었습니다."}


@app.get(
    "/run-crawler",
    summary="크롤러 실행 및 MySQL에 데이터 저장",
    description="주의! 필요할 때만 실행하세요. 30~60초 정도 소요됩니다.",
)
async def run_crawler(background_tasks: BackgroundTasks,
                      credentials: HTTPAuthorizationCredentials = Security(security)):
    verify_api_key(credentials)

    # 크롤러 실행
    result = fetch_and_convert()

    # CSV 파일들을 MySQL에 삽입하는 작업을 백그라운드로 실행
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
async def save_to_redis(credentials: HTTPAuthorizationCredentials = Security(security)):
    verify_api_key(credentials)

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
    description="",
)
async def json_data(background_tasks: BackgroundTasks,
                    credentials: HTTPAuthorizationCredentials = Security(security)):
    verify_api_key(credentials)

    json_data = make_json()
    if json_data:
        return json.loads(json_data)
    else:
        raise HTTPException(status_code=500, detail="JSON 데이터를 생성하는 중 오류가 발생했습니다.")


@app.get(
    "/make-json-type1",
    summary="전체 데이터를 JSON 형식으로 제공 (Type 1)",
    description="",
)
async def json_data_type1(background_tasks: BackgroundTasks,
                          credentials: HTTPAuthorizationCredentials = Security(security)):
    verify_api_key(credentials)

    json_data = make_json_type1()
    if json_data:
        return json.loads(json_data)
    else:
        raise HTTPException(status_code=500, detail="JSON 데이터를 생성하는 중 오류가 발생했습니다.")


@app.get(
    "/query-classroom-json/{building_id}/{classroom_id}",
    summary="특정 강의실 정보 조회. 예) 무용/B105",
    description="JSON 형태",
)
async def query_classroom_json(building_id: str, classroom_id: str):
    data = get_json_from_redis('classroom_data')
    classroom_id = building_id + classroom_id

    if not data or building_id not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building_id}을(를) 찾을 수 없습니다.")

    if classroom_id not in data[building_id]:
        raise HTTPException(status_code=404, detail=f"강의실 {classroom_id}을(를) 찾을 수 없습니다.")

    return {
        "classroom": classroom_id,
        "schedule": {
            "time": data[building_id][classroom_id]["time"],
            "courses": data[building_id][classroom_id]["courses"]
        }
    }


@app.get(
    "/query-classroom-table/{building_id}/{classroom_id}",
    summary="특정 강의실 정보 조회. 예) 1공/401-1",
    description="RDB TABLE 형태"
)
async def query_classroom_table(building_id: str, classroom_id: str):
    data = get_json_from_redis('classroom_data')
    classroom_id = building_id + classroom_id

    if not data or building_id not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building_id}을(를) 찾을 수 없습니다.")

    if (classroom_id) not in data[building_id]:
        raise HTTPException(status_code=404, detail=f"강의실 {classroom_id}을(를) 찾을 수 없습니다.")

    result = []

    for course in data[building_id][classroom_id]["courses"]:
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
        if b_id == "체": # 일단 처리
            return {classroom for classroom in classroom_list if b_id in classroom and "체육" not in classroom}
        else:
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


@app.get(
    "/query-classroom-period/{building_id}/{day}/{period}",
    summary="특정 건물, 특정 요일, 특정 교시로 빈 강의실 및 사용 중인 강의실 정보 조회 예) 미디어/수/3",
    description=""
)
async def query_classroom_period(building_id: str, day: str, period: int):
    classroom_list = get_all_classroom_list()
    classroom_list_in_building = {classroom for classroom in classroom_list if building_id in classroom}

    data = get_json_from_redis('classroom_data')
    if not data or building_id not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building_id}을(를) 찾을 수 없습니다.")
    if not classroom_list_in_building:
        raise HTTPException(status_code=404, detail=f"건물 {building_id}에 강의실이 없습니다.")
    if day not in ["월", "화", "수", "목", "금"]:
        raise HTTPException(status_code=400, detail="요일은 월,화,수,목,금 중 하나여야 합니다.")

    occupied_classrooms = set()
    detailed_occupied_classrooms = []
    for room in data[building_id].values():
        for course in room["courses"]:
            if day in course["parse_days"]:
                for i, time in enumerate(course["parse_times"]):
                    if time["start"] <= period <= time["end"] and course["parse_days"][i] == day:
                        if building_id in course["parse_rooms"][i]:  # 건물 ID와 강의실 비교
                            occupied_classrooms.add(course["parse_rooms"][i])
                            detailed_occupied_classrooms.append({
                                "course_name": course["course_name"],
                                "professor": course["professor"],
                                "org_time": course["org_time"],
                                "room": course["parse_rooms"][i],
                                "day": course["parse_days"][i],
                                "start": time["start"],
                                "end": time["end"],
                            })

    empty_classrooms = classroom_list_in_building - occupied_classrooms
    return {
        "building": building_id,
        "day": day,
        "period": period,
        "empty_classrooms": sorted(empty_classrooms),
        "occupied_classrooms": sorted(occupied_classrooms),
        "occupied_classrooms_detail": sorted(detailed_occupied_classrooms, key=lambda x: x["room"])
    }


@app.get(
    "/query-classroom-period-ext/{building_id}/{day}",
    summary="특정 건물, 특정 요일로 모든 교시의 빈 강의실 및 사용 중인 강의실 정보 조회 예) 미디어/수",
    description=""
)
async def query_classroom_period_ext(building_id: str, day: str):
    classroom_list = get_all_classroom_list()
    classroom_list_in_building = {classroom for classroom in classroom_list if building_id in classroom}

    data = get_json_from_redis('classroom_data')
    if not data or building_id not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building_id}을(를) 찾을 수 없습니다.")
    if not classroom_list_in_building:
        raise HTTPException(status_code=404, detail=f"건물 {building_id}에 강의실이 없습니다.")
    if day not in ["월", "화", "수", "목", "금"]:
        raise HTTPException(status_code=400, detail="요일은 월,화,수,목,금 중 하나여야 합니다.")

    building_data = data[building_id].values()

    def process_period(period):
        occupied_classrooms = set()
        detailed_occupied_classrooms = set()
        for room in building_data:
            for course in room["courses"]:
                if day in course["parse_days"]:
                    for i, time in enumerate(course["parse_times"]):
                        if time["start"] <= period <= time["end"] and course["parse_days"][i] == day:
                            if building_id in course["parse_rooms"][i]:
                                occupied_classrooms.add(course["parse_rooms"][i])
                                detailed_occupied_classrooms.add((
                                    course["course_name"],
                                    course["professor"],
                                    course["org_time"],
                                    course["parse_rooms"][i],
                                    course["parse_days"][i],
                                    time["start"],
                                    time["end"],
                                ))

        empty_classrooms = classroom_list_in_building - occupied_classrooms

        # building_id가 "체"이면 "체육"이 포함된 강의실 제거
        if building_id == "체":
            occupied_classrooms = {room for room in occupied_classrooms if "체육" not in room}
            empty_classrooms = {room for room in empty_classrooms if "체육" not in room}

        return {
            "empty_classrooms": sorted(empty_classrooms),
            "occupied_classrooms": sorted(occupied_classrooms),
            "occupied_classrooms_detail": sorted(
                [dict(zip(["course_name", "professor", "org_time", "room", "day", "start", "end"], item))
                 for item in detailed_occupied_classrooms],
                key=lambda x: x["room"]
            )
        }

    with ThreadPoolExecutor() as executor:
        period_results = dict(zip(range(1, 25), executor.map(process_period, range(1, 25))))

    return {
        "building": building_id,
        "day": day,
        "period_results": period_results
    }


@app.get(
    "/query-course-table/{course_name}",
    summary="과목명으로 수업 정보 조회",
    description=""
)
async def query_course_table(course_name: str):
    data = get_json_from_redis('classroom_data')
    if not data:
        raise HTTPException(status_code=404, detail="데이터를 찾을 수 없습니다.")

    result = []
    for building in data.values():
        for room in building.values():
            for course in room["courses"]:
                # 입력한 문자열이 course_name에 포함되는 경우 검색
                if course_name.strip() in course["course_name"].strip():
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
    if not result:
        raise HTTPException(status_code=404, detail="해당 과목의 수업 정보를 찾을 수 없습니다.")

    unique_result = list({json.dumps(item, sort_keys=True): item for item in result}.values())
    sorted_result = sorted(unique_result,
                           key=lambda x: (x["course_name"], x["professor"], x["org_time"], x["course_room"],
                                          x["org_time"], x["start"]))
    return sorted_result
