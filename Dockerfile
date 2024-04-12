FROM --platform=linux/amd64 node:21.6.2
#FROM  node:21.6.2

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV production

CMD [ "node", "server.js" ]
