DOCKER_COMPOSE_FILE = docker-compose.yml
FRONT_FOLDER= ./front
MAKEFILE_FOLDER= ./make_src
NGINX_FOLDER= ./nginx

LOCAL_IP := $(shell ipconfig getifaddr en1)
GLOBAL_IP := $(shell curl ifconfig.me)
ENV_FILE = ./.env
NGINX_CONF = nginx/nginx.conf

# all: local init up
all: init up

local:
	sed -i '' "s/localhost/$(LOCAL_IP)/g" $(ENV_FILE) $(NGINX_CONF)

global:
	sed -i '' "s/localhost/$(GLOBAL_IP)/g" $(ENV_FILE) $(NGINX_CONF)

init:
	cp ${MAKEFILE_FOLDER}/.env_local ${FRONT_FOLDER}/.env
	cp ${MAKEFILE_FOLDER}/.env_local ./.env
	cp ${MAKEFILE_FOLDER}/nginx_local.conf ${NGINX_FOLDER}/nginx.conf

init_multi:
	cp ${MAKEFILE_FOLDER}/.env_multi ${FRONT_FOLDER}/.env
	cp ${MAKEFILE_FOLDER}/.env_multi ./.env
	cp ${MAKEFILE_FOLDER}/nginx_multi.conf ${NGINX_FOLDER}/nginx.conf

up:
	@-docker-compose -f ${DOCKER_COMPOSE_FILE} up -d --build

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

db: 
	@-docker-compose exec postgres psql transcendencedb

.PHONY: all init up down stop restart nuke db local global init_multi