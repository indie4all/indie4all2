# syntax=docker/dockerfile:1
FROM node:18
ENV NODE_ENV production
RUN apt-get -y update
COPY . .
RUN apt-get -y install openjdk-11-jre-headless
RUN mkdir preview
RUN npm install pm2 -y -g
RUN npm install -y
CMD ["pm2-runtime", "pm2.config.js"]
EXPOSE 8000
