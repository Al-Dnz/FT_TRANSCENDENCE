DOCKER_COMPOSE_FILE = docker-compose.yml

all: postgresql nestjs

postgresql:
	@-docker-compose -f ${DOCKER_COMPOSE_FILE} up --build -d

nestjs:
	cd app ; npm install ; npm run start:dev

down:
	@-docker-compose -f ${DOCKER_COMPOSE_FILE} down

nuke:
	@-docker stop $(docker ps -qa)
	@-docker rmi $(docker ps -qa)
	@-docker system prune --force --all

.PHONY: all postgresql nestjs down nuke