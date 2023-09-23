FROM node:16.14.2-bullseye-slim AS base

LABEL Name=lifeline-socket Version=1.0.0
EXPOSE 5050
ENV DEBIAN_FRONTEND=noninteractive

RUN   apt-get update && apt-get install -y --no-install-recommends \
    locales \
    tzdata \
    ca-certificates \
    libpq-dev \
    && echo "America/Mazatlan" > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata \
    && sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
    && echo 'LANG="en_US.UTF-8"'>/etc/default/locale \
    && dpkg-reconfigure --frontend=noninteractive locales \
    && update-locale LANG=en_US.UTF-8 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir /home/node/app && chown -R node:node /home/node
USER node
WORKDIR /home/node/app
COPY --chown=node:node package.json package-lock.json* ./
ENV PATH=/app/node_modules/.bin:$PATH
RUN npm install --no-optional && npm cache clean --force
CMD ["npm", "run", "dev"]
FROM base as prod
COPY --chown=node:node . ./
CMD ["npm", "run", "start"]