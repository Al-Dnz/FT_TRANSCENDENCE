FROM	node:16

WORKDIR	/usr/app

COPY	. .

RUN		npm install

EXPOSE 	3000

CMD		[ "npm", "run", "start:dev" ]

# CMD ["node", "dist/main"]

# FROM node:18 AS builder

# ADD . /app
# WORKDIR /app

# RUN npm install && npm run build

# FROM gcr.io/distroless/nodejs:18
# COPY --from=builder /app /app

# WORKDIR /app/dist

# EXPOSE 3000

# CMD [ "main.js" ]