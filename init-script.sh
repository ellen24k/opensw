#!/bin/bash

# 백엔드 API 호출하여 초기 데이터 구성
echo "백엔드 API 호출하여 초기 데이터 구성 중..."

# API 키 설정 (환경 변수에서 가져옴)
API_KEY=${CRAWLER_API_KEY:-default_api_key}

# 백엔드 URL 설정 (호스트에서 실행할 때는 localhost 사용)
BACKEND_URL="http://localhost:8000"

# 크롤러 실행
echo "크롤링 실행 중..."
curl -X GET "$BACKEND_URL/run-crawler" \
  -H "Authorization: Bearer $API_KEY"
echo ""

# MySQL 삽입이 완료될 때까지 대기 (백그라운드 태스크 처리 시간)
echo "데이터 삽입 대기 중 (10초)..."
sleep 10

# Redis에 저장
echo "Redis에 데이터 저장 중..."
curl -X GET "$BACKEND_URL/save-to-redis" \
  -H "Authorization: Bearer $API_KEY"
echo ""

echo "초기화 완료!"