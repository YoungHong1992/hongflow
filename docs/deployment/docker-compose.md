# Docker Compose

`docker-compose.yml` 默认启动以下服务：

- `postgres`
- `redis`
- `api`
- `worker`
- `web`

默认端口：

- `3000`: Web
- `3001`: API

首次启动前请先准备 `.env`：

```bash
cp .env.example .env
docker compose up -d --build
```
