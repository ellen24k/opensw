import re
from typing import List


def parse_line(line):
    parts = line.split(',')
    yy = parts[0].strip()
    semCd = parts[1].strip()
    dvclsNb = parts[2].strip()
    subjId = parts[3].strip()
    subjKnm = parts[4].strip()
    rooms_original = parts[5].replace('<p>', ', ')
    rooms = parts[5].split('<p>')
    professor = parts[6].strip()
    result = []

    for r in rooms:
        match = re.match(r"([가-힣])(\d+)~(\d+)\((.*?)(\d+)\)", r.strip())
        if match:
            day = match.group(1)
            start_time = match.group(2)
            end_time = match.group(3)
            building = match.group(4)
            roomNo = match.group(5)
            timeStr = f"{day}{start_time}~{end_time}"
            room_full = f"{building}{roomNo}"

            result.append({
                "yy": yy,
                "semCd": semCd,
                "dvclsNb": dvclsNb,
                "course_code": subjId,
                "course_name": subjKnm,
                "time": timeStr,
                "day": day,
                "start_time": start_time,
                "end_time": end_time,
                "building": building,
                "room": roomNo,
                "room_full": room_full,
                "rooms_original": rooms_original,
                "professor": professor,
            })
    return result


def generate_json_type1(raw_data: List[str]):
    parsed_data = []
    for line in raw_data:
        parsed_data.extend(parse_line(line))

    building_json = {}
    for item in parsed_data:
        bld = item["building"]
        rm = item["room"]
        room_full = f"{bld}{rm}"

        if bld not in building_json:
            building_json[bld] = {}
        if room_full not in building_json[bld]:
            building_json[bld][room_full] = {"time": [], "courses": []}

        # 시간 정보 추가
        if item["time"] not in building_json[bld][room_full]["time"]:
            building_json[bld][room_full]["time"].append(item["time"])

        # 과목 정보 추가 (중복 검사)
        course_exists = False
        for course in building_json[bld][room_full]["courses"]:
            if course["course_code"] == item["course_code"]:
                course_exists = True
                break

        if not course_exists:
            building_json[bld][room_full]["courses"].append({
                "course_code": item["course_code"],
                "course_name": item["course_name"],
                # "org_time": f"{item['time']}({room_full})",
                "org_time": item["rooms_original"],
                "professor": item["professor"],
            })

    # 중복 제거 및 time 정보 재구성 (courses의 시간 정보만 포함)
    for bld in building_json:
        for room_full in building_json[bld]:
            valid_times = []
            for course in building_json[bld][room_full]["courses"]:
                # 현재 강의실에 해당하는 시간 정보만 추출
                time_pattern = f"([가-힣]\\d+~\\d+)\\({room_full}\\)"
                time_matches = re.findall(time_pattern, course["org_time"])
                valid_times.extend(time_matches)

            # 중복 제거 후 유효한 시간만 포함
            building_json[bld][room_full]["time"] = list(set(valid_times))

    return building_json


def parse_org_time(org_time):
    course_rooms = []
    days = []
    times = []

    time_entries = org_time.split(", ")
    for entry in time_entries:
        # 괄호 안의 강의실 정보 추출
        room_info = ""
        if "(" in entry and ")" in entry:
            room_info = entry.split("(")[1].split(")")[0]
            course_rooms.append(room_info)

        # 요일과 시간 정보 추출
        day_time = entry.split("(")[0] if "(" in entry else entry

        # 요일 추출 (첫 글자)
        day = ''.join([c for c in day_time if not c.isdigit() and c != '~'])
        days.append(day)

        # 시작 및 종료 시간 추출
        time_parts = ''.join([c for c in day_time if c.isdigit() or c == '~']).split('~')
        start = int(time_parts[0]) if len(time_parts) > 0 and time_parts[0].isdigit() else None
        end = int(time_parts[1]) if len(time_parts) > 1 and time_parts[1].isdigit() else None
        times.append({"start": start, "end": end})

    return {
        "parse_rooms": course_rooms,
        "parse_days": days,
        "parse_times": times
    }
