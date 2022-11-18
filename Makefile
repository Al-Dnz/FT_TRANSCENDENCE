DOCKER_COMPOSE_FILE = docker-compose.yml

all: up

up:
	@-docker-compose -f ${DOCKER_COMPOSE_FILE} up -d

down:
	@-docker-compose -f ${DOCKER_COMPOSE_FILE} down

stop:
	@-docker-compose -f ${DOCKER_COMPOSE_FILE} stop

restart:
	@-docker-compose -f ${DOCKER_COMPOSE_FILE} restart

nuke:
	@-docker stop $(docker ps -qa)
	@-docker rmi $(docker images -qa)
	@-docker system prune --force --all
	@-docker volume prune --force
	@-docker network prune --force

.PHONY: all up down stop restart nuke