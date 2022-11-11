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

```bash
POSTGRES_HOST=postgres
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=transcendencedb
REDIRECT_URI=http://localhost/api/auth/callback
CLIENT_ID=<your_42_API_UUID>
CLIENT_SECRET=<your_42_API_SECRET>
REFRESH_TOKEN_SECRET=refresh
ACCESS_TOKEN_SECRET=access
```

## CONFIG OWN DB

https://www.codementor.io/@engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb

## EXPLORE POSTGRESQL DB

go on container:

```
docker compose exec postgres bash
```

connect to db:

```
psql transcendencedb
```

see all db

```
\l
```

use trnascendencedb:

```
\c transcendencedb
```

show tables:

```
\dt
```

get data from table <table>:

```
select * from <table> ;
```
