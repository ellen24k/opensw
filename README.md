
# 🏫빈 강의실 찾기 프로젝트

---

## 📌 프로젝트 개요

*본 프로젝트는 단국대학교(죽전) 학생 및 교직원들을 대상으로<br/>
시험기간 및 수업과 수업 사이 시간적 여유가 있을 때<br/>
머무를 수 있는 강의실을 조회하는 서비스 개발을 목적으로 한다.<br/>*

- **과목**: 오픈소스SW기초
- **분반**: 3분반
- **담당 교수**: 송인식 교수님
- **기간**: 2025. 03. ~ 2025. 06.

---
## 🚀 Live Demo
<img src='https://raw.githubusercontent.com/ellen24k/opensw/master/backend/resources/QR_opensw.png' width='300'>

- **[https://opensw.ellen24k.kro.kr](https://opensw.ellen24k.kro.kr)**

---

# 👥 팀 구성 및 역할
- 프론트 
  - 신승호(팀장)
    - 아이디어 구체화 및 UI/UX 설계
    - Figma를 활용한 UI 디자인
    - React 프론트엔드 개발: 강의실 시간표 Page / Navigation Bar 구현
  - 이현승
    - 아이디어 구체화 및 UI/UX 설계
    - React 프론트엔드 개발: 빈 강의실 페이지
    - 프론트엔드 의존성 관리
  - 최준성
    - 아이디어 구체화 및 UI/UX 설계
    - React 프론트엔드 개발: 내 시간표 Page 구현
    - 코드 검수
  
- 백엔드 
  - 김태영
    - 클라우드에 도커 및 쿠버네티스 환경 설정 
    - 도메인 설정 
    - HTTPS 프록시 설정 
    - 개발용 도커 설정 
    - 배포용 Kubernetes 설정(컨트롤러, 서비스, HPA) 
    - 컨테이너 레지스트리 설정
    - 깃허브 레포지토리 및 커뮤니티 관리 - 스크럼, WIKI, 디스커션 관리 
    - 깃허브 커밋 및 히스토리 관리
    - CI/CD 구축 - 깃허브 웹훅과 젠킨스 연동으로 빌드 및 자동 배포 
    - 슬랙 알림 메시지 제공
    - 강의 시간표 크롤링 기능 구현
    - MySQL, Redis 데이터베이스 구축
    - 구축한 데이터베이스와 연동하여 API 제공
    - 관리자 API 인증 처리 (Bearer Token)
    - 보안 및 서버 관리
    - API 서버 캐시 기능 구현
    - HPA 및 캐시 기능의 성능, 부하 테스트 및 모니터링 >> [테스트 결과 링크](k6.md)

<br/>
<br/>
<br/>


# 🏫 사용자 가이드

---


## ✨ 주요 기능

- 특정 시간 동안 사용 가능한 빈 강의실 조회
- 특정 교시에 수업 중인 강의실 정보 조회
- 특정 강의실 일주일 간 수업 정보 조회
- 내 시간표 등록 및 강의실 수업 정보 조회

---

## 🖼️ UX/UI 설계 및 사용법 
 - 빈 강의실

| **이벤트**               | **사진**                                                                                                                                                                        | **설명**                                             |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------|
|빈 강의실 페이지 접속       |<img width="400" alt="FindEmptyClassPage" src="https://github.com/user-attachments/assets/7fb094e3-afb3-4d49-b658-8ba99b88a8f8" />                                               |메인 페이지 접속 후 상단 네비게이션 바에서 "빈 강의실" 선택|
|건물 드롭다운 클릭          |<img width="400" alt="FindEmptyClassPage(BuildingFilter Dropdown)" src="https://github.com/user-attachments/assets/e3a3dd05-ee97-4fd6-bf40-e4c0801202b7" />                      |건물 드롭다운 메뉴 선택                                   |
|건물 1개 선택 (드롭다운 메뉴)|<img width="400" alt="FindEmptyClassPage(BuildingFilter Dropdown - 소프트 selected)" src="https://github.com/user-attachments/assets/86242c70-0b36-4ce6-afb3-c83dea9f2a32" />    |건물 드롭다운 메뉴에서 1개 항목 선택                      |
|건물 1개 선택 (드롭다운 닫기)|<img width="400" alt="FindEmptyClassPage(소프트 selected)" src="https://github.com/user-attachments/assets/5b24470d-b558-4ba5-a95a-b9772a44db66" />                              |건물 1개 선택 시 필터링 결과                               |
|건물 1개, 층 1개 선택       |<img width="400" alt="FindEmptyClassPage(소프트 5층 selected)" src="https://github.com/user-attachments/assets/02ed8f1c-2153-478d-80cc-72c495e49b8e" />                           |건물 1개, 층 1개 선택 시 필터링 결과                      |
|건물 1개, 층 2개 선택       |<img width="400" alt="FindEmptyClassPage(소프트 3층, 5층 selected)" src="https://github.com/user-attachments/assets/a57e134b-667b-4b4f-a689-fba3989c45b5" />                      |건물 1개, 층 2개 선택 시 필터링 결과                      |
|건물 2개 선택 (드롭다운 메뉴)|<img width="400" alt="FindEmptyClassPage(BuildingFilter Dropdown - 2공, 소프트 selected)" src="https://github.com/user-attachments/assets/3c2205f2-d8e5-4259-b9db-215c5022b9b4" />|건물 드롭다운 메뉴에서 2개 항목 선택                      |
|건물 2개 선택 (드롭다운 닫기)|<img width="400" alt="FindEmptyClassPage(2공, 소프트 selected)" src="https://github.com/user-attachments/assets/ba742b3a-6d0f-4c5d-b047-e395dbe20703" />                          |건물 2개 선택 시 필터링 결과                              |
|강의실 선택                 |<img width="400" alt="FindEmptyClassPage(소프트101 selected)" src="https://github.com/user-attachments/assets/6f29399d-d444-4c48-bf17-ec2fcddfa6aa" />                            |강의실 선택 시 표시되는 강의실 정보                      |
|주간 시간표 보기 클릭        |<img width="400" alt="주간 시간표 보기 버튼" src="https://github.com/user-attachments/assets/ce487df7-38d3-4694-babc-a9a6f6114823" /><img width="400" alt="ViewClassSchedulePage/소프트101" src="https://github.com/user-attachments/assets/e33715a2-dc28-469d-8d8a-7a075ab5de22" />|강의실 정보에서 주간 시간표 보기 버튼 클릭시 강의실 시간표로 이동|
|요일 변경                   |<img width="400" alt="WeekdayFilter" src="https://github.com/user-attachments/assets/62549b69-0ddd-4127-9b48-f5ca086631a5" />                                                    |요일 선택 시 다른 요일의 빈 강의실 조회 가능 (오늘 요일은 미선택 시 파란 테두리로 표시)|
|30분 뒤 사용 가능한 강의실 보기 클릭|<img width="400" alt="30분 뒤 사용 가능한 강의실 보기 버튼" src="https://github.com/user-attachments/assets/0a7bfbc5-f5fd-451a-8620-83a7c9504143" />                         |하단의 "30분 뒤 사용 가능한 강의실 보기" 버튼 클릭 시 선택된 시작 시간이 30분 증가|

 - 강의실 시간표


| **이벤트**     | **사진**                                                                                             | **설명**|
|-------------------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------|
|메인 페이지 접속          |![image](https://github.com/user-attachments/assets/5a043e4d-063d-4207-8b64-c0f9c0b4bd71)    |메인 페이지 접속 후 상단 네비게이션 바에 "강의실 시간표 선택"|
|강의실(필수) 콤보박스 클릭|![image (1)](https://github.com/user-attachments/assets/548e7b63-92c2-44a2-af3a-5f2d4f942b70)|필터링을 원하지 않을 경우 강의실(필수) 콤보박스에서 원하는 강의실 선택|
|건물 및 층수 콤보박스 클릭|![image (2)](https://github.com/user-attachments/assets/b50974d4-ffd8-46a4-af99-53acd6005943)![image (3)](https://github.com/user-attachments/assets/5982a4d3-c211-42f0-bd18-8645dbfddc42)|조회하고자 하는 건물과 층수 선택 후 필터링 된 강의실을 강의실(필수) 콤보박스에서 확인|
|검색 클릭                |![image (4)](https://github.com/user-attachments/assets/9839a955-d54c-43a7-a409-36eeba035b18)|검색 버튼을 눌러 강의실 시간표 조회                          |
|초기화 버튼 클릭         |![image (5)](https://github.com/user-attachments/assets/050bf25f-01c0-498c-9b68-e3d438aadfbb)|초기화 버튼 누를 시 선택된 필터 조건 모두 초기화              |






 - 내 시간표

| **이벤트**     | **사진**                                                                                             | **설명**|
|-------------------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------|
|메인 페이지 접속          |![image](https://github.com/user-attachments/assets/5a043e4d-063d-4207-8b64-c0f9c0b4bd71)    |메인 페이지 접속                                            |
|과목 직접 선택하기 모드    |![image](https://github.com/user-attachments/assets/11beff11-2d8c-433d-ac5e-dde2db4a6ab0)    |아래는 과목 직접 선택하기 모드에서의 설명이다.                |
|아래쪽 과목 검색하기 클릭  |![image](https://github.com/user-attachments/assets/1daf3e27-6410-4327-9231-52efec49331a)![image](https://github.com/user-attachments/assets/7345dcde-5e06-4747-8fc7-2f15914717de)|BottomSheet 활성화|
|검색어 입력               |![image](https://github.com/user-attachments/assets/90807e99-9b94-4804-9f73-78a4fe2ea901)    |검색하고자 하는 과목 입력 시 추가/제거 가능한 과목 리스트 출력 |
|추가/제거 버튼 클릭       |![image](https://github.com/user-attachments/assets/3aed4884-a83e-42a2-ad0d-6a30f3d50dc5)![image](https://github.com/user-attachments/assets/5614c2b7-5c16-421c-a046-6b3a253a2313)|추가/제거 버튼을 눌러 내 시간표에 추가/제거|
|시간표 한번에 등록 모드   |![image](https://github.com/user-attachments/assets/ff26fa9c-5d70-413b-9365-792a9fe93660)    |아래는 시간표 한번에 등록 모드에서의 설명이다.                 |
|시간표 한번에 등록 버튼 클릭|![image](https://github.com/user-attachments/assets/2188811c-7fb2-41c5-ac2e-bbcd4213e7cf)    |BottomSheet가 자동으로 활성화되며 활성화 상태로 고정         |
|BottomSheet 상단 하이퍼링크 클릭|![image](https://github.com/user-attachments/assets/3bcd5494-1106-4626-9b3b-611984be7e84)![image](https://github.com/user-attachments/assets/a2611e4f-5475-420a-8d8c-5f50f4ce9c82)|단국대학교 웹정보 수강신청 정보 페이지가 새 창에서 열림|
|제출 버튼 클릭           |![image](https://github.com/user-attachments/assets/61164e9b-342c-4ade-8958-7faf95d92e58)![image](https://github.com/user-attachments/assets/22f24b56-dd6c-4f3f-af49-6869ff2b5f23)|자동으로 과목 직접 선택하기 모드로 변경되며, 내 시간표에 붙여넣은 내용이 등록됨|
|없음           |![image](https://github.com/user-attachments/assets/298874cd-832f-4e96-92d0-c52d85b2a892)![image](https://github.com/user-attachments/assets/4ebd905a-56c4-4d2e-9c8a-862823b0e4e7)![image](https://github.com/user-attachments/assets/a935c7b2-ae3a-4eb5-acf1-432a0866ccd5)|내 시간표와 현재 시간에 따라 이전/현재/다음 수업 정보를 표시|
|초기화 버튼 클릭         |![image](https://github.com/user-attachments/assets/fe2511ba-efc2-4f9a-ba29-81f4582208cd)|내 시간표에 저장된 과목들을 초기화              |



<br/>
<br/>
<br/>

# 🏫 개발자 가이드

---


## 📡 백엔드 API 엔드포인트

| **HTTP 메서드** | **엔드포인트** (*표시는 인증 필요)                                 | **설명**                                   |
|-----------------|--------------------------------------------------------|-------------------------------------------|
| GET             | `/`                                                    | API의 기본 상태를 확인합니다.              |
| POST            | `/set-cache-ttl`*                                      | 캐시 TTL 값을 설정합니다.                  |
| GET             | `/run-crawler`*                                        | 데이터를 크롤링하고 MySQL에 저장합니다.    |
| GET             | `/save-to-redis`*                                      | 데이터를 Redis에 저장합니다.               |
| GET             | `/make-json`*                                          | MySQL 데이터를 JSON 형식으로 반환합니다.   |
| GET             | `/make-json-type1`*                                    | MySQL 데이터를 Type 1 JSON 형식으로 반환합니다. |
| GET             | `/query-classroom-json/{building}/{classroom_id}`      | 특정 강의실 정보를 JSON 형태로 조회합니다. |
| GET             | `/query-classroom-table/{building}/{classroom_id}`     | 특정 강의실 정보를 테이블 형태로 조회합니다. |
| GET             | `/query-building-json/{building_id}`                   | 특정 건물의 모든 강의실 정보를 JSON 형태로 조회합니다. |
| GET             | `/query-building-table/{building_id}`                  | 특정 건물의 모든 강의실 정보를 테이블 형태로 조회합니다. |
| GET             | `/query-classroom-list`                                | 모든 강의실 리스트를 조회합니다.           |
| GET             | `/query-classroom-list/{building_id}`                  | 특정 건물의 강의실 리스트를 조회합니다.    |
| GET             | `/query-building-list`                                 | 모든 건물 리스트를 조회합니다.             |
| GET             | `/query-classroom-period/{building_id}/{day}/{period}` | 특정 요일 특정 교시에 빈 강의실 정보를 조회합니다. |
| GET             | `/query-classroom-period-ext/{building_id}/{day}`      | 특정 요일 모든 교시의 빈 강의실 정보를 조회합니다. |

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분                 | 기술 스택                                                                                                               |
|----------------------|---------------------------------------------------------------------------------------------------------------------|
| **백엔드 개발**       | `Python`, `FastAPI`<br>`MySQL`, `Redis`<br>`requests` (크롤링)<br>`Swagger` (API 문서화)                                  |
| **프론트엔드 개발**   | `React`, `Npm`<br>`HTML`, `CSS`<br>`Axios` (API 호출)<br>`Bootstrap` (스타일링)<br>`Material UI` (스타일링)<br>`Figma` (UI 디자인)         |
| **CI/CD 및 배포 환경**| `Oracle Cloud Infrastructure (OCI)`<br>`OCIR` (Oracle Container Registry)<br>`GitHub`, `Jenkins`<br>`k3s`, `Docker` |
| **버전 관리 및 보안** | `Git`<br>`CORS`, `HTTPS`                                                                                            |
| **테스트 및 모니터링**| `K6` (성능/부하 테스트)<br>`InfluxDB` (성능 데이터 저장)<br>`Grafana` (모니터링)<br>`Apidog` (API 테스트)                               |


---

## 🖥️ 배치 다이어그램

<img src='https://raw.githubusercontent.com/ellen24k/opensw/master/backend/resources/deployment_diagram.png' width='500'>

---

## 📂 프로그램 설치 및 실행 방법

### 사전 준비 사항
* Docker, Git, Python latest version
* Redis, MySQL Container

### 설치 단계

1.  **저장소 복제**:
* git clone https://github.com/ellen24k/opensw.git

2.  **환경 변수 설정**:
* MYSQL_PASSWORD=your_mysql_password
* CRAWLER_API_KEY=your_crawler_api_key
* RDS_GET_ALL_CLASSROOM_LIST=your_redis_query_value
* .env* 파일에 backend 서버의 URL 설정

3.  **Docker 네트워크 생성 및 설정**:
* docker network create net 으로 docker network 생성
* Redis 및 MySQL IP 설정 값 확인 후 적용
* backend CORS 에 front 도메인 혹은 IP 설정

4.  **빌드 및 실행**:
* Dockerized / Container-based
  * docker-compose -f frontend/docker-compose.yml up -d --build
  * docker-compose -f backend/docker-compose.yml up -d --build
* Local / Native / Host-based
  * frontend
    * npm install
    * npm run start
  * backend
    * python3 -m venv .venv
    * .venv/Scripts/activate
    * pip install -r requirements.txt
    * python -m uvicorn main:app --host 0.0.0.0 --port 8000

### 애플리케이션 접속

* Dockerized / Container-based URL: `http://localhost:13080`
* Local / Native / Host-based URL: `http://localhost:3000`

---

## 📖 용어
- **React**: 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리.
- **Figma**: UI/UX 디자인 도구로, 프로토타입 및 디자인을 작성하는 데 사용.
- **FastAPI**: Python 기반의 웹 프레임워크로, API 서버를 구축하는 데 사용.
- **Bootstrap**: HTML, CSS, JavaScript로 작성된 프론트엔드 프레임워크로, 반응형 웹 디자인을 지원.
- **MUI**: Bootstrap과 마찬가지로 미리 만들어진 프론트엔드 프레임워크. 구글의 디자인 철학이 반영된 Material UI를 사용할 수 있음.
- **Docker**: 애플리케이션을 컨테이너화하여 배포하는 플랫폼.
- **k3s**: 경량화된 Kubernetes 배포판으로, 리소스가 제한된 환경에서 Kubernetes 클러스터를 운영하는 데 사용.
- **Replica**: 동일한 애플리케이션 인스턴스를 여러 개 실행하여 부하를 분산시키는 방식. Kubernetes의 ReplicaSet을 통해 관리.
- **HPA (Horizontal Pod Autoscaler)**: Kubernetes에서 Pod의 수를 자동으로 조정하여 부하를 처리하는 기능.
- **Container Registry**: Docker 이미지를 저장하고 관리하는 레지스트리 서비스.
- **P90/P95 응답 시간**: 요청 중 90% 또는 95%가 해당 시간 이내에 처리된다는 것을 의미하는 지표.
- **K6**: 성능 및 부하 테스트 도구로, JavaScript 기반 스크립트를 사용하여 API 호출을 시뮬레이션.
- **처리율 (Throughput)**: 단위 시간당 처리된 요청의 수.
- **에러율 (Error Rate)**: 전체 요청 중 실패한 요청의 비율.
- **캐시 TTL (Time To Live)**: 캐시 데이터의 유효 기간을 설정하는 값. TTL이 짧으면 데이터 최신성이 높아지고, 길면 시스템 부하가 줄어듦.
- **CORS**: Cross-Origin Resource Sharing의 약자로, 웹 애플리케이션이 다른 도메인에서 리소스를 요청할 수 있도록 허용하는 보안 기능.
- **vCPU**: 가상 CPU의 약자로, 가상화된 환경에서 CPU의 성능을 측정하는 단위.
- **InfluxDB**: 시계열 데이터베이스로, 성능 테스트 데이터를 저장하고 분석하는 데 사용.
- **Grafana**: InfluxDB와 연동하여 실시간 모니터링 대시보드를 제공하는 도구.
- **Redis**: 메모리 기반의 데이터 저장소로, 빠른 데이터 접근을 위해 사용.
- **CI/CD**: Continuous Integration/Continuous Deployment의 약자로, 코드 변경 사항을 자동으로 빌드하고 배포하는 프로세스.
- **Jenkins**: CI/CD 도구로, 자동화된 빌드 및 배포 프로세스를 지원.
- **HTTP Bearer**: 클라이언트가 인증 토큰(Bearer Token)을 HTTP 헤더에 담아 서버에 인증 정보를 전달하는 방식.
- **Swagger**: API 문서화를 위한 도구로, FastAPI와 함께 사용하여 API 엔드포인트를 문서화.
- **Apidog**: API 테스트 및 문서화를 위한 도구로, API 요청을 시뮬레이션하고 응답을 확인하는 데 사용.

---

## 📚 레퍼런스
- React 공식 문서: [https://reactjs.org/](https://reactjs.org/)
- Figma 공식 문서: [https://www.figma.com/](https://www.figma.com/)
- Bootstrap 공식 문서: [https://getbootstrap.com/](https://getbootstrap.com/)
- MUI 공식 문서: [https://mui.com/](https://mui.com/)
- FastAPI 공식 문서: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- Docker 공식 문서: [https://docs.docker.com/](https://docs.docker.com/)
- Kubernetes 공식 문서: [https://kubernetes.io/](https://kubernetes.io/)
- Jenkins 공식 문서: [https://www.jenkins.io/doc/](https://www.jenkins.io/doc/)
- K6 공식 문서: [https://k6.io/docs/](https://k6.io/docs/)
- InfluxDB 공식 문서: [https://www.influxdata.com/](https://www.influxdata.com/)
- Grafana 공식 문서: [https://grafana.com/](https://grafana.com/)
- Redis 공식 문서: [https://redis.io/](https://redis.io/)
