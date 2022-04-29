FROM node:15-alpine as base

WORKDIR /src
COPY package.json yarn.lock /src/
COPY . /src

EXPOSE 4000

FROM base as production

RUN npm i -g pm2
RUN yarn install --production=false
RUN yarn build

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--only", "api-revea", "--env", "production"]


FROM base as development

RUN npm i -g pm2
RUN yarn install --production=false
RUN yarn build

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--only", "dev-api-revea", "--env", "development"]

FROM base as local

ENV NODE_ENV=development
RUN yarn install

CMD ["yarn", "start"]
