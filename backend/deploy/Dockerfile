FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app

COPY backend/deploy/requirements.txt .
RUN pip install -r requirements.txt

# COPY . .

WORKDIR /app/backend

EXPOSE 8000
