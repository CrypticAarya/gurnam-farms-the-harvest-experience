# Dockerfile - builds the Vite app and serves the static `dist` folder.
# Note: This is a static hosting Dockerfile. If you require server-side
# rendering (SSR) or TanStack Start server runtime, adapt this to run the
# server entrypoint instead of serving static files.

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "0.0.0.0:4173"]
