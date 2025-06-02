# 베이스 이미지로 최신 Python 이미지를 사용합니다.
FROM python:3.13-slim-bullseye

ENV PYTHONDONTWRITEBYTECODE=1

ENV PYTHONUNBUFFERED=1

# 작성자 정보를 추가합니다.
LABEL authors="ellen24k"

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 필요한 파일들을 컨테이너로 복사합니다.
COPY requirements.txt requirements.txt

# 의존성 패키지를 설치합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드를 컨테이너로 복사합니다.
COPY . .

# FastAPI 애플리케이션을 실행합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]