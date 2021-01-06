.PHONY: help

# Project variables
PROJECT_NAME ?= almond-be
TARGET_MAX_CHAR_NUM=10
# File names
DOCKER_DEV_COMPOSE_FILE := docker-compose.yml

.PHONY: help build start stop clean

#@-- help command to show usage of make commands --@#
help:
	@echo ''
	@echo 'Usage:'
	@echo '${YELLOW} make ${RESET} ${GREEN}<target> [options]${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		message = match(lastLine, /^## (.*)/); \
		if (message) { \
			command = substr($$1, 0, index($$1, ":")-1); \
			message = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} %s\n", command, message; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
	@echo ''

#@-- command to build the application image--@#
background:
	${INFO} "Building required docker images"
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) build app
	@ ${INFO} "Starting background local development server"
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) up -d

#@-- command to start the application container --@#
start:
	${INFO} "Starting docker process"
	${INFO} "Creating mongo database volume"
	@ docker pull mongo:4.4.2-bionic
	@ docker volume create --name=dbdata > /dev/null
	@ echo " "
	@ ${INFO} "Building required docker images"
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) build app
	@ ${INFO} "Build Completed successfully"
	@ echo " "
	@ ${INFO} "Starting local development server"
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) up

#@-- command to stop the application container --@#
stop:
	${INFO} "Stop development server containers"
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) down -v
	${INFO} "All containers stopped successfully"

#@-- command to test the application --@#
test:background
	@ ${INFO} "Running tests in docker container"
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) exec web yarn test

#@-- command to remove the images created --@#
clean:
	${INFO} "Cleaning your local environment"
	${INFO} "Note all ephemeral volumes will be destroyed"
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) down -v
	@ docker volume rm db_data
	@ docker images -q -f label=application=$(PROJECT_NAME) | xargs -I ARGS docker rmi -f ARGS
	${INFO} "Removing dangling images"
	@ docker images -q -f dangling=true -f label=application=$(PROJECT_NAME) | xargs -I ARGS docker rmi -f ARGS
	@ docker system prune
	${INFO} "Clean complete"

#@-- command to run seeders, the application needs to be running using make start --@#
seed:
ifeq ($(CONTAINER),)
	$(call container_err)
else
	${INFO} "Running default almond seeders"
	@docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) exec app yarn seed:data
	${SUCCESS} "Seeds executed successfully"
endif


#@-- command to ssh into service container --@#
ssh:background
	${INFO} "Opening app container terminal"
	@ docker-compose -f $(DOCKER_DEV_COMPOSE_FILE) exec app bash

#@-- help should be run by default when no command is specified --@#
default: help

# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
MAGENTA  := $(shell tput -Txterm setaf 5)
NC := "\e[0m"
RESET  := $(shell tput -Txterm sgr0)

# Shell Functions
INFO := @bash -c 'printf $(YELLOW); echo "===> $$1"; printf $(NC)' SOME_VALUE
EXTRA := @bash -c 'printf "\n"; printf $(MAGENTA); echo "===> $$1"; printf "\n"; printf $(NC)' SOME_VALUE
SUCCESS := @bash -c 'printf $(GREEN); echo "===> $$1"; printf $(NC)' SOME_VALUE
