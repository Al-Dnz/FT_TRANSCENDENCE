DOCKER_COMPOSE_FILE = docker-compose.yml

all: up

up:
	@-docker-compose -f ${DOCKER_COMPOSE_FILE} up -d

down:
	@-docker-compose -f ${DOCKER_COMPOSE_FILE} down

nuke:
	@-docker stop $(docker ps -qa)
	@-docker rmi $(docker ps -qa)
	@-docker system prune --force --all
	@-docker volume prune --force
	@-docker network prune --force

.PHONY: all up down nuke