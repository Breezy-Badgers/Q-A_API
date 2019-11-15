FROM node:10.16.0
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN npm install


EXPOSE 8080

CMD ["node", "server.js"]