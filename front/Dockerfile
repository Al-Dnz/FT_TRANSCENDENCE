FROM node:18 AS builder
WORKDIR /app

ENV VUE_APP_CALLBACK=https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5ab70555bfa46d107ad4aad7001afe0aebd346fbda51f7c31c1b4e4881d33717&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapp%2Fcallback&response_type=code
ADD . /app
WORKDIR /app
RUN npm install && npm run build

# production stage
FROM nginx:1.22.1-alpine
COPY --from=builder /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
