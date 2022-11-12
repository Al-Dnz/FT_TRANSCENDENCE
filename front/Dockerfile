FROM node:18 AS builder
WORKDIR /app

RUN mkdir -p /app

ADD front /app/front
WORKDIR /app/front
RUN npm install && npm run build

# production stage
FROM nginx:1.22.1-alpine
COPY --from=builder /app/front/dist /app
COPY front/nginx.conf /etc/nginx/nginx.conf 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
