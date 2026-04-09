FROM node:24-alpine

ARG VITE_API_BASE_URL=http://localhost:3001/api

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "--filter", "@hongflow/web", "preview", "--host", "0.0.0.0", "--port", "3000"]
