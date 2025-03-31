import pandas as pd
import requests

# yy: 2025, #년도
# semCd: 1, #학기
# qrySxn: 1, #1: 전공, 2: 교양, 3: 학문기초
# lesnPlcCd: 1, #1: 죽전캠, 2: 천안캠
#
#dvclsNb: 1 # 분반
#subjId: 과목코드
#subjKnm: 강의명
#buldAndRoomCont: 수13~18(소프트304)
#wkLecrEmpnm: 교수명



# 데이터를 크롤링하고 CSV 파일로 변환하는 함수
def fetch_and_convert():
    url = 'https://webinfo.dankook.ac.kr/tiac/univ/lssn/lpci/views/lssnPopup/tmtbl.do'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    }

    # 요청 파라미터
    def create_params(yy, semCd, qrySxn, curiCparCd, lesnPlcCd, mjSubjKnm, mjDowCd, grade, pfltNm):
        return {
            'yy': yy,
            'semCd': semCd,
            'qrySxn': qrySxn,
            'curiCparCd': curiCparCd,
            'lesnPlcCd': lesnPlcCd,
            'mjSubjKnm': mjSubjKnm,
            'mjDowCd': mjDowCd,
            'grade': grade,
            'pfltNm': pfltNm
        }

    yy = '2025'
    semCd = '1'

    params = [
        create_params(yy, semCd, '1', '', '1', '', '', '', ''),
        create_params(yy, semCd, '2', '', '1', '', '', '', ''),
        create_params(yy, semCd, '3', '', '1', '', '', '', ''),
        # create_params(yy, semCd, '1', '', '2', '', '', '', ''),
        # create_params(yy, semCd, '2', '', '2', '', '', '', ''),
        # create_params(yy, semCd, '3', '', '2', '', '', '', '')
    ]

    # 결과 저장용 CSV 파일명
    csv_filenames = ['custom1.csv', 'custom2.csv', 'custom3.csv']#, 'custom4.csv', 'custom5.csv', 'custom6.csv']
    # json_filenames = ['custom1.json', 'custom2.json', 'custom3.json']

    for i, param in enumerate(params):
        # 요청 보내기
        response = requests.post(url, headers=headers, data=param)

        if response.status_code != 200:
            return f"Error: Failed to fetch data for qrySxn={param['qrySxn']}"

        # JSON 파싱
        data = response.json()

        # 필요한 필드 추출
        rows = [
            [entry['yy'], entry['semCd'], entry['dvclsNb'], entry['subjId'], entry['subjKnm'], entry['buldAndRoomCont'],
             entry['wkLecrEmpnm']]
            for entry in data.get('lctTmtblDscMjList', [])
        ]

        # Pandas DataFrame을 이용해 CSV로 저장
        df = pd.DataFrame(rows,
                          columns=['yy', 'semCd', 'dvclsNb', 'subjId', 'subjKnm', 'buldAndRoomCont', 'wkLecrEmpnm'])

        # CSV로 저장
        df.to_csv(csv_filenames[i], index=False, header=False)

    return csv_filenames  # 결과로 생성된 CSV 파일 목록을 반환
