FROM node:19.1.0-alpine3.16

WORKDIR /app
RUN apk add gcompat tini git
# 换成自己的
RUN git clone https://github.com/bincooo/worker-laf.git tmp
RUN cp /app/tmp/docker-entrypoint.sh .
RUN chmod -R 777 /app && \
  chmod +x /app/docker-entrypoint.sh && \
  rm -rf tmp
RUN npm install -g pnpm
EXPOSE 3000
ENTRYPOINT ["/bin/sh", "/app/docker-entrypoint.sh"]