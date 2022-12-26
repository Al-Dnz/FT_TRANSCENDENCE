# FT_TRANSCENDENCE

## LAUNCH

```
 make
```

```
http://localhost:3000
```

After use don't forget to

```
make down
```

## CAREFFUL

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

## EXPLORE DB

```
make db
```

## TO DO

[ ] remove adenhez user seed

[ ] check if mailing is connected