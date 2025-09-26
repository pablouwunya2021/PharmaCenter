# Etapa 1: Compilar la aplicación (manteniendo tu estructura)
FROM node:22-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir los archivos con Nginx (mejorada)
FROM nginx:stable-alpine AS production

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Etapa 3: Desarrollo con hot reload
FROM node:22-alpine AS development
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
