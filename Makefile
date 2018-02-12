.PHONY: all run start-server start-docker stop-docker

all:
	npm install

run: start-docker start-server 

start-server:
	npm start

start-docker:
	docker-compose -f docker/docker-antidote-3dcs.yml up -d

stop-docker:
	docker-compose -f docker/docker-antidote-3dcs.yml down

