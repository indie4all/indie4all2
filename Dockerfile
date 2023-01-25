# syntax=docker/dockerfile:1
FROM node:18
ENV NODE_ENV production
RUN apt-get -y update
RUN apt-get -y install openjdk-11-jre-headless
RUN mkdir -p /home/node/indie4all2 && chown -R node:node /home/node/indie4all2
WORKDIR /home/node/indie4all2
RUN npm install pm2 -y -g
USER node
COPY --chown=node:node . .
RUN mkdir preview
RUN npm install -y
CMD ["pm2-runtime", "pm2.config.js"]
EXPOSE 8000
