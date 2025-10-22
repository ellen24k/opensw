# 빈 강의실 찾기 프로젝트 로컬 실행 가이드

이 가이드는 빈 강의실 찾기 프로젝트를 로컬 환경에서 Docker를 사용하여 실행하는 방법을 안내합니다.

## 사전 요구사항

- Docker 및 Docker Compose 설치
- Git

## 실행 단계

### 1. 저장소 복제 (이미 완료된 경우 생략)

```bash
git clone https://github.com/ellen24k/opensw.git
cd dku-classroom
```

### 2. 환경 변수 설정 (이미 설정된 기본값 있음)

`.env` 파일이 이미 생성되어 있으며, 필요한 경우 수정할 수 있습니다:

```
MYSQL_PASSWORD=mysql_password
CRAWLER_API_KEY=default_api_key
CRAWLER_YEAR=2025
CRAWLER_SEMESTER=2
```

### 3. Docker Compose로 서비스 실행

서비스를 시작하고 모든 서비스가 준비될 때까지 기다리려면:
```bash
docker compose up -d --wait
```

또는 단순히 서비스를 백그라운드로 시작하려면:
```bash
docker compose up -d
```

이 명령은 다음 서비스들을 실행합니다:
- MySQL 데이터베이스 (포트 3306)
- Redis 캐시 서버 (포트 6379)
- 백엔드 FastAPI 서버 (포트 8000)
- 프론트엔드 React 애플리케이션 (포트 3000)

### 4. 초기 데이터 로드 (최초 1회만 실행)

모든 서비스가 준비된 후, 호스트에서 직접 초기화 스크립트를 실행합니다:
```bash
# 스크립트에 실행 권한 부여 (이미 설정된 경우 생략)
chmod +x init-script.sh

# 모든 서비스가 준비될 때까지 기다린 후 실행하는 방법:
docker compose up -d --wait && ./init-script.sh

# 또는 서비스가 이미 실행 중이라면 바로 초기화 스크립트를 실행:
./init-script.sh
```

이 스크립트는 데이터 크롤링 및 Redis에 데이터 저장 등의 초기화 작업을 수행합니다.

### 4. 서비스 접속

- 프론트엔드: http://localhost:3000
- 백엔드 API 문서: http://localhost:8000/docs

### 5. 서비스 중지

```bash
docker-compose down
```

### 6. 서비스 중지 및 모든 데이터 삭제

```bash
docker-compose down -v
```

## 문제 해결

### 초기 데이터 로드 방법

초기화를 수행하려면 호스트에서 다음 명령어를 사용합니다:

```bash
# 초기화 스크립트 실행
./init-script.sh
```

또는 수동으로 다음 API를 호출할 수도 있습니다:

```bash
# API 키 설정
export CRAWLER_API_KEY=default_api_key

# 데이터 크롤링
curl -X GET "http://localhost:8000/run-crawler" \
  -H "Authorization: Bearer $CRAWLER_API_KEY"

# Redis에 데이터 저장
curl -X GET "http://localhost:8000/save-to-redis" \
  -H "Authorization: Bearer $CRAWLER_API_KEY"
```

참고: 초기화는 필요할 때만 실행하세요. 매번 서버를 시작할 때마다 실행할 필요는 없습니다.

### 컨테이너 로그 확인

```bash
# 전체 로그 확인
docker-compose logs

# 특정 서비스 로그 확인 (예: 백엔드)
docker-compose logs backend
```