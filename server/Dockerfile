FROM node:latest as base
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "server"]

