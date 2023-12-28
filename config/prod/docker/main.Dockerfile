FROM node:18-alpine

WORKDIR /var/www/ay_detect_proxy_rn

COPY package*.json ./

RUN npm install node-gyp node-pre-gyp -g

RUN yarn

COPY . .

RUN yarn build

COPY ./dist ./dist

CMD [ "yarn", "start" ]