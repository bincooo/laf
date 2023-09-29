FROM node:19.1.0-alpine3.16

ADD . /app
WORKDIR /app

RUN pnpm install
ENTRYPOINT ["pnpm", "dev"]