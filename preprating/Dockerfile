# --- стадия сборки (dev) ---
FROM node:18-alpine AS dev

WORKDIR /app

# Сначала копируем только package.json + package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь код
COPY . .

# В режиме dev включаем polling, чтобы работало в Docker
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

# Запуск dev‑сервера с хот‑релоадом
CMD ["npm", "start"]