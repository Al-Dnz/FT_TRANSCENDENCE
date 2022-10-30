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
