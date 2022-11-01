#
# ADD . /app
# WORKDIR /app
#
# RUN npm install && npm run build
#
# FROM gcr.io/distroless/nodejs:18
# COPY --from=builder /app /app
#
# WORKDIR /app/dist
#
# ENV PORT="3000"
#
# CMD [ "main.js" ]
#

FROM node:18 AS builder
WORKDIR /app

ADD . .

RUN npm install && npm run build

# production stage
FROM nginx:1.22.1-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
