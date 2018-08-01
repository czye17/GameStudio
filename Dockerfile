FROM node:carbon

WORKDIR /app

COPY . .

RUN npm install
RUN npm install -g nodemon

EXPOSE 4040

CMD [ "nodemon", "app.js" ]