FROM node:20.10.0

WORKDIR /var/www/ay_detect_proxy_rn

COPY package*.json ./

RUN npm install node-gyp node-pre-gyp -g -f

# RUN npm install --global npm@latest

RUN yarn -f

COPY . .

RUN yarn build

COPY ./dist ./dist

CMD [ "yarn", "start:dev" ]