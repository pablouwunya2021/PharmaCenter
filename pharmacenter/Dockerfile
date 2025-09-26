#FROM nginx:alpine
#COPY  . /usr/share/nginx/html
#EXPOSE 80

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

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]