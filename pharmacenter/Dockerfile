# Etapa 1: Construcción
FROM node:22-alpine AS build
WORKDIR /app

# Copiar dependencias y construir
COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:stable-alpine AS production

# Copiar archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]