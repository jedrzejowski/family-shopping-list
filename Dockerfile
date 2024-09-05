ARG ALPINE_VERSION=3.20

FROM rust:1-alpine${ALPINE_VERSION} AS backend

# Install build dependencies
RUN apk add --no-cache build-base musl-dev openssl-dev openssl

WORKDIR /app

COPY backend/Cargo.toml backend/Cargo.lock ./

RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo fetch
RUN cargo build --release
RUN rm  src/main.rs

COPY backend/src ./src/
RUN touch src/main.rs
RUN cargo build --release

FROM node:22-alpine${ALPINE_VERSION} AS frontend

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/src/ ./src/
COPY frontend/public/ ./public/
COPY frontend/tsconfig.* ./
COPY frontend/vite.config.ts ./
COPY frontend/eslint.config.js ./
COPY frontend/index.html ./

RUN npm run build

RUN ls

FROM alpine:${ALPINE_VERSION}


USER 1000:1000

ENV SERVER_DIR=/app/static
ENV SERVER_PORT=8080
ENV SERVER_HOST=0.0.0.0

WORKDIR /app

COPY --from=backend /app/target/release/family-shop-list ./
COPY --from=frontend /app/dist/ ./static

CMD [ "/app/family-shop-list" ]
