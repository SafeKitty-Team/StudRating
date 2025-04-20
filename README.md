# Viribus-Unitis

docker-compose up --build


если не запускается

docker-compose down --rmi all --volumes --remove-orphans

docker system prune --all --volumes --force


#### Миграции
```bash
cd backend/app &&
alembic upgrade head
```
