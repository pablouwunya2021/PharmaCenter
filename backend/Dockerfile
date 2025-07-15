FROM node:22-alpine

WORKDIR /app

# Instala dependencias primero (caché eficiente)
COPY package*.json ./
RUN npm install

# Copia el resto
COPY . .

EXPOSE 3000
CMD ["node", "src/app.js"]