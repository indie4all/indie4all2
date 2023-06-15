# syntax=docker/dockerfile:1
FROM node:18
ENV NODE_ENV production
ENV PIDUSAGE_USE_PS true
RUN apt-get -y update
RUN apt-get -y install openjdk-17-jre-headless
RUN npm install -g npm@8.19.3
RUN npm install pm2 -y -g
WORKDIR /usr/src/app
COPY . .
RUN mkdir preview
RUN mkdir media
RUN npm install --silent
RUN mv node_modules ../
RUN chown -R node /usr/src/app
EXPOSE 8000
USER node
CMD ["pm2-runtime", "pm2.config.js"]
