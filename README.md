# verticalott-LMS Backend

Monorepo backend for a microservices-based LMS platform (similar to Udemy), built with:

- Node.js / TypeScript
- Express
- PostgreSQL + Sequelize
- Redis
- Nx (monorepo and orchestration)
- Docker / docker-compose

## Structure

- `backend/` — all backend services and shared libraries
  - `api-gateway/`
  - `auth-service/`
  - `user-service/`
  - `course-service/`
  - `content-service/`
  - `video-service/`
  - `enrollment-service/`
  - `payment-service/`
  - `progress-service/`
  - `review-service/`
  - `notification-service/`
  - `common/`, `database/`, `types/`

## Getting Started

```bash
cd backend
npm install
npm start   # runs all services via Nx
```

