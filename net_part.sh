#!/bin/bash
# Script to partition away an Antidote replica from its Docker cluster.

DOCKER_FILE=docker/docker-antidote-3dcs.yml
REPLICA_NAME=antidote

case "$1" in
ispart)
    docker-compose -f $DOCKER_FILE exec --privileged $REPLICA_NAME$2 bash -c 'iptables -L -n -v' | grep DROP
    ;;
create)
    docker-compose -f -d $DOCKER_FILE exec --privileged $REPLICA_NAME$2 bash -c \
        'iptables -A INPUT -p tcp --dport 8086 -j DROP; iptables -A OUTPUT -p tcp --dport 8086 -j DROP'
    ;;
remove)
    docker-compose -f -d $DOCKER_FILE exec --privileged $REPLICA_NAME$2 bash -c \
        'iptables -D INPUT -p tcp --dport 8086 -j DROP; iptables -D OUTPUT -p tcp --dport 8086 -j DROP'
    ;;
*)
    echo $"Usage: $0 {create|remove|ispart}"
    exit 1
    ;;
esac
