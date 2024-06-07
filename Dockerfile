FROM node:21-alpine3.18 as builder
# stage 1
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
COPY tools ./tools
RUN npm install -g npm@latest
RUN npm ci && npm run build

FROM node:21-alpine3.18
# stage 2
WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
RUN npm install -g pm2 npm@latest
RUN npm ci --production 
# Only installs dependences not devDependecies
COPY --from=builder /app/build ./build

EXPOSE 4006

CMD [ "npm", "run", "start" ]