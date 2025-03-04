# Stage 1: Build application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

# Stage 2: Production server
FROM nginx:1.25-alpine
RUN apk add --no-cache bash
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S -G nodejs nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

USER nodejs
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]