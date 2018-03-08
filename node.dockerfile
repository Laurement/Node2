FROM node:carbon
EXPOSE 8000:8000
RUN npm install
CMD npx nodemon index.js