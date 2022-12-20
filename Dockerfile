# syntax=docker/dockerfile:1
FROM node:18
ENV NODE_ENV production
RUN apt-get -y update
COPY . .
RUN apt-get -y install openjdk-11-jre-headless
RUN npm install -y
CMD node server.js
EXPOSE 8000
