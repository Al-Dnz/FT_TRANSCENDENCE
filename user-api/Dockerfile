FROM node:18 AS builder

RUN mkdir -p /app 

ADD db-interface/ /app/db-interface
WORKDIR /app/db-interface
RUN npm install

ADD user-api/ /app/user-api
WORKDIR /app/user-api
RUN npm install && npm run build

FROM gcr.io/distroless/nodejs:18
COPY --from=builder /app/user-api /app

WORKDIR /app/dist

ENV PORT="3000"

CMD [ "user-api/src/main.js" ]
