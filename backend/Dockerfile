FROM python:3.12-slim

WORKDIR /app

# Сначала списки зависимостей
COPY requirements.txt ./

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копируем весь код приложения
COPY . .

# При старте контейнера сперва запустим тестовые данные,
# а затем — основное приложение.
CMD ["sh", "-c", "python app/test_data.py && python app/main.py"]
