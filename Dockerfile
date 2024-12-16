FROM node:21.0.0-alpine as build

WORKDIR /app/movies-restful-api

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:21.0.0-alpine as production

WORKDIR /app/movies-restful-api

RUN apk add --no-cache curl bash

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

COPY --from=build /app/movies-restful-api/dist ./dist
COPY --from=build /app/movies-restful-api/node_modules ./node_modules
COPY --from=build /app/movies-restful-api/package.json .
COPY --from=build /app/movies-restful-api/tsconfig.json .

EXPOSE 3000

CMD ["npm", "start"]