FROM node:18.17.1

# https://github.com/Yelp/dumb-init
RUN echo 'Installing dumb-init...' \
    && curl -sfS -L https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 -o /usr/bin/dumb-init \
    && chmod a+x /usr/bin/dumb-init

RUN echo 'Installing ffmpeg...' \
    && apt update  \
    && apt install -y ffmpeg \
    && ffmpeg -version

WORKDIR /app
COPY .. /app
RUN npm install

USER node
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "docker/index.js"]
