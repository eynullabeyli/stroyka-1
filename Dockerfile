FROM node:latest
WORKDIR /

COPY package*.json ./
COPY prisma ./prisma/ 
RUN npm install

COPY . .
EXPOSE 3000
CMD [ "npm","start"]