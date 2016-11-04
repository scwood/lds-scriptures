FROM node

WORKDIR /app

COPY package.json /app
RUN npm install

COPY index.js scriptures.db /app/

EXPOSE 3000
CMD ["npm", "start"]
