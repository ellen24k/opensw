import json
import os

import mysql.connector
import pandas as pd

from func.data_processor import generate_json_type1


# MySQL 데이터베이스 연결 함수
def connect_to_mysql():
    return mysql.connector.connect(
        host='172.22.22.22',  # MySQL 서버 호스트
        user='opensw',  # MySQL 사용자명
        password=os.getenv("MYSQL_PASSWORD"),  # MySQL 비밀번호
        database='opensw'  # 사용할 데이터베이스
    )


# CSV 파일을 MySQL 테이블에 삽입하는 함수
def import_csv_to_mysql(csv_file: str, first_insert=False):
    connection = connect_to_mysql()
    cursor = connection.cursor()

    try:
        # 첫 번째로 실행되는 경우에만 테이블 데이터를 삭제 (TRUNCATE)
        if first_insert:
            cursor.execute("TRUNCATE TABLE custom")
            print("custom 테이블의 데이터가 모두 삭제되었습니다.")

        # CSV 파일 열기
        with open(csv_file, mode='r', encoding='utf-8') as file:
            csv_reader = pd.read_csv(file)

            # NaN 값을 빈 문자열로 대체
            csv_reader = csv_reader.fillna('')

            # CSV 파일에서 각 행을 읽고 삽입
            for row in csv_reader.itertuples(index=False, name=None):
                # MySQL에 데이터 삽입
                query = """
                    INSERT INTO custom (yy, semCd, dvclsNb, subjId, subjKnm, buldAndRoomCont, wkLecrEmpnm)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(query, row)

            # 변경 사항을 커밋
            connection.commit()
            print(f"{csv_file} 데이터가 성공적으로 삽입되었습니다.")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        connection.close()


# 데이터베이스에서 데이터를 가져와 JSON으로 변환하는 함수
def make_json():
    connection = connect_to_mysql()
    cursor = connection.cursor(dictionary=True)

    try:
        # 데이터베이스에서 데이터 가져오기
        cursor.execute("SELECT * FROM custom")
        rows = cursor.fetchall()

        # JSON으로 변환
        json_data = json.dumps(rows, ensure_ascii=False, indent=2)
        return json_data
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None
    finally:
        cursor.close()
        connection.close()


def make_json_type1():
    connection = connect_to_mysql()
    cursor = connection.cursor(dictionary=True)

    try:
        # 데이터베이스에서 데이터 가져오기
        cursor.execute("SELECT * FROM custom")
        rows = cursor.fetchall()

        # 데이터베이스에서 가져온 데이터를 raw_data 형식으로 변환
        raw_data = []
        for row in rows:
            raw_data.append(
                f"{row['yy']},{row['semCd']},{row['dvclsNb']},{row['subjId']},{row['subjKnm']},{row['buldAndRoomCont']},{row['wkLecrEmpnm']}")

        # JSON으로 변환
        json_data = json.dumps(generate_json_type1(raw_data), ensure_ascii=False, indent=2)
        return json_data
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None
    finally:
        cursor.close()
        connection.close()
