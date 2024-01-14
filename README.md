# FT_TRANSCENDENCE

## DESCRIPTION

FT_TRANSCENDANCE is an web video-game app that offers online pong games. 
A chat is avaiable to make friend and play with them

## STACK

Backend: NestJS
Frontend: VueJS
Web server:  Nginx 
Container system: Docker

FT_TRANSCENDANCE is build as a micro-services app. Containers are distributed as follows:
* Auth service
* Users service
* Game service
* Chat service
* Frontend service
* Web-server service

## LAUNCH

```
 make
```

```
http://localhost:8000
```

## ENV VAR

don't forget to set up a .env file at the root of the project with env variable:

```
POSTGRES_HOST=postgres
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=transcendencedb

CLIENT_ID=<your_42_API_UUID>
CLIENT_SECRET=<your_42_API_SECRET>

REFRESH_TOKEN_SECRET=refresh
ACCESS_TOKEN_SECRET=access

VUE_APP_IP=localhost
REDIRECT_URI=http://localhost/api/auth/callback
VUE_APP_CALLBACK=<URL_of_API_callback>

EMAIL_HOST=smtp.sendgrid.net
EMAIL_USER=apikey
EMAIL_FROM=<your_SENDGRID_API_sender_domain>
EMAIL_PASSWORD=<your_SENDGRID_API_password>
```

## EXPLORE DB FROM SERVER

```
make db
```
