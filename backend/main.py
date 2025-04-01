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


# todo 캠퍼스별 건물명 그냥 크롤링으로 가져온 것 수동으로 분석 할 것. 혹은 그냥 죽전만 하는 것으로
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
    "/query-classroom/{classroom_id}",
    summary="특정 강의실 정보 조회",
    description="특정 강의실의 시간표와 강의 정보를 조회합니다. 예) 소프트304",
)
async def query_classroom(classroom_id: str):
    data = get_json_from_redis('classroom_data')

    # 건물명
    building = ''.join([c for c in classroom_id if not c.isdigit()])

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
    "/query-classroom-schedule/{classroom_id}",
    summary="강의실 시간표 상세 정보 조회",
    description="특정 강의실의 모든 강의 일정을 구조화된 형태로 조회합니다. 예) 소프트516"
)
async def query_classroom_schedule(classroom_id: str):
    data = get_json_from_redis('classroom_data')

    building = ''.join([c for c in classroom_id if not c.isdigit()])

    # 데이터 검증
    if not data or building not in data:
        raise HTTPException(status_code=404, detail=f"건물 {building}을(를) 찾을 수 없습니다.")

    if classroom_id not in data[building]:
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

    return {
        "building": building_id,
        "courses": courses
    }
