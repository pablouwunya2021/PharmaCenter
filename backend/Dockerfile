# Etapa 1: Dependencias
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Etapa 2: Producción
FROM node:22-alpine AS production
WORKDIR /app

EXPOSE 3000

# Healthcheck simple (verifica que el puerto esté abierto)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "src/server.js"]