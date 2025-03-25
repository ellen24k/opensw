import json

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from func.crawler import fetch_and_convert
from func.mysql import import_csv_to_mysql, make_json, make_json_type1
from func.data_processor import parse_org_time
from func.redis import save_json_to_redis, get_json_from_redis

app = FastAPI(
    title="OpenSW API",
    description="강의실 정보 제공 API",
)

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://opensw.ellen24k.kro.kr",
        "https://opensw-dev.ellen24k.kro.kr",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/run-crawler",
    summary="크롤러 실행 및 MySQL에 데이터 저장",
    description="주의! 필요할 때만 실행하세요. 30~60초 정도 소요됩니다.",
)
async def run_script(background_tasks: BackgroundTasks):
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


@app.get("/")
async def root():
    return {"message": "/docs 에서 API 문서를 확인하세요."}


@app.get(
    "/make-json",
    summary="JSON 데이터 생성",
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
    summary="JSON 데이터 생성 (Type 1)",
    description="MySQL에서 데이터를 가져와 JSON 형식으로 변환합니다.",
)
async def json_data_type1():
    json_data = make_json_type1()
    if json_data:
        return json.loads(json_data)
    else:
        raise HTTPException(status_code=500, detail="JSON 데이터를 생성하는 중 오류가 발생했습니다.")


@app.get(
    "/save-to-redis",
    summary="데이터를 정제하여 Redis에 저장",
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
        save_json_to_redis('classroom_data', data_obj_type1)
        print("classroom_data 저장 완료")
        return {"message": "데이터가 Redis에 성공적으로 저장되었습니다."}
    else:
        raise HTTPException(status_code=500, detail="Redis에 데이터를 저장하는 중 오류가 발생했습니다.")


@app.get(
    "/query-classroom/{classroom_id}",
    summary="특정 강의실 정보 조회",
    description="특정 강의실의 시간표와 강의 정보를 조회합니다. 예) 소프트304",
)
async def query_classroom(classroom_id: str):
    data = get_json_from_redis('classroom_data')

    # 건물명과 강의실로 분리 (예: "소프트304" -> "소프트", "304")
    building = ''.join([c for c in classroom_id if not c.isdigit()])
    room = ''.join([c for c in classroom_id if c.isdigit()])
    full_classroom = building + room

    # 데이터 검증
    if not data or building not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building}을(를) 찾을 수 없습니다.")

    if full_classroom not in data[building]:
        raise HTTPException(status_code=404, detail=f"강의실 {full_classroom}을(를) 찾을 수 없습니다.")

    parsed_courses = []
    for course in data[building][full_classroom]["courses"]:
        parsed_course = course.copy()
        parsed_course.update(parse_org_time(course["org_time"]))
        parsed_courses.append(parsed_course)

    return {
        "classroom": full_classroom,
        "schedule": {
            "time": data[building][full_classroom]["time"],
            "courses": parsed_courses
        }
    }


@app.get(
    "/query-classroom-schedule/{classroom_id}",
    summary="강의실 시간표 상세 정보 조회",
    description="특정 강의실의 모든 강의 일정을 구조화된 형태로 조회합니다. 예) 소프트516"
)
async def query_classroom_schedule(classroom_id: str):
    data = get_json_from_redis('classroom_data')

    # 건물명과 강의실로 분리 (예: "소프트304" -> "소프트", "304")
    building = ''.join([c for c in classroom_id if not c.isdigit()])
    room = ''.join([c for c in classroom_id if c.isdigit()])
    full_classroom = building + room

    # 데이터 검증
    if not data or building not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building}을(를) 찾을 수 없습니다.")

    if full_classroom not in data[building]:
        raise HTTPException(status_code=404, detail=f"강의실 {full_classroom}을(를) 찾을 수 없습니다.")

    result = []

    # 각 강의에 대해 시간 정보 파싱
    for course in data[building][full_classroom]["courses"]:
        time_info = course["org_time"]
        time_entries = time_info.split(", ")

        for entry in time_entries:
            # 괄호 안의 강의실 정보 추출
            room_info = ""
            if "(" in entry and ")" in entry:
                room_info = entry.split("(")[1].split(")")[0]

            # 요일과 시간 정보 추출
            day_time = entry.split("(")[0] if "(" in entry else entry

            # 요일 추출 (첫 글자)
            day = ''.join([c for c in day_time if not c.isdigit() and c != '~'])

            # 시작 및 종료 시간 추출
            time_parts = ''.join([c for c in day_time if c.isdigit() or c == '~']).split('~')
            start = int(time_parts[0]) if len(time_parts) > 0 and time_parts[0].isdigit() else None
            end = int(time_parts[1]) if len(time_parts) > 1 and time_parts[1].isdigit() else None

            result.append({
                "course_code": course["course_code"],
                "course_name": course["course_name"],
                "course_room": room_info,
                "day": day,
                "start": start,
                "end": end,
                "professor": course["professor"]
            })

    return result


@app.get(
    "/query-building/{building_id}",
    summary="특정 건물의 모든 강의실 정보 조회",
    description="특정 건물의 모든 강의실 정보를 조회합니다. 예) 소프트"
)
async def query_building(building_id: str):
    data = get_json_from_redis('classroom_data')

    # 데이터 검증
    if not data or building_id not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building_id}을(를) 찾을 수 없습니다.")

    courses = []
    for room in data[building_id].values():
        courses.extend(room['courses'])

    for room in data[building_id].values():
        for course in room['courses']:
            course.update(parse_org_time(course['org_time']))
            courses.append(course)

    return {
        "building": building_id,
        "courses": courses
    }
