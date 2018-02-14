.PHONY: all run start-server start-docker stop-docker

all:
	npm install

run: start-docker start-server 

start-server:
	npm start

start-server-test-deploy:
	PORT=3000 NODE_ENV=production npm start > webshell.log 2>&1

start-docker:
	docker-compose -f docker/docker-antidote-3dcs.yml up -d

stop-docker:
	docker-compose -f docker/docker-antidote-3dcs.yml down

