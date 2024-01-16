FROM node:20.10.0

WORKDIR /var/www/ay_detect_proxy_rn

COPY . .

RUN npm install node-gyp node-pre-gyp -g -f

RUN yarn -f

RUN yarn build

COPY ./dist ./dist

CMD [ "yarn", "start:dev" ]