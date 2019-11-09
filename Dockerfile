FROM node:10.16.0
RUN mkdir /app
ADD . /app
RUN npm install


EXPOSE 8080
CMD ["node", "app/server.js"]