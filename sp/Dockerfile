FROM node:19

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install --prod

# Bundle app source
COPY database.js .
COPY sp.js .
COPY index.js .
COPY views/ ./views/

EXPOSE 3000
CMD [ "node", "index.js" ]
