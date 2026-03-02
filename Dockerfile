FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml README.md ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir "flask>=3.1.0,<4.0.0" "gunicorn>=23.0.0,<24.0.0"

COPY app.py ./
COPY templates ./templates
COPY static ./static

EXPOSE 9001

CMD ["gunicorn", "--bind", "0.0.0.0:9001", "--workers", "2", "--threads", "4", "app:app"]
