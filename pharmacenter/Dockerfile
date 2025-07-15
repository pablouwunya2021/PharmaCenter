#FROM nginx:alpine
#COPY  . /usr/share/nginx/html
#EXPOSE 80

# Etapa 1: Compilar la aplicación
FROM node:22-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir los archivos con Nginx
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
