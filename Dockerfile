FROM imbios/bun-node:latest

COPY . .

RUN npm install node-gyp node-pre-gyp -g -f

RUN bun i 

RUN bun run build 

CMD [ "node", "dist/main" ]