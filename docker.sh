#!/usr/bin/env bash
cd "$(dirname "$0")"

NC='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'

function log_message() {
    color=${2:-${GREEN}}
    echo -e "${color}${1}${NC}"
}

ACCESS_TOKEN='paste your access token here'

case ${1} in
    b | build )
        VERSION="$(date +'%s')"
        docker build -t argue-bot:${VERSION} .
        docker tag argue-bot:${VERSION} argue-bot:latest
        ;;

    r | run )
        docker run -d -p 8080:3000 -e ACCESS_TOKEN=${ACCESS_TOKEN} argue-bot:latest
        ;;

    s | stop )
        CONTAINER_ID="$(docker ps -q -f=ancestor=argue-bot:latest)"
        if [ -z "${CONTAINER_ID}" ]; then log_message "Can't find running backend container" ${RED}; fi

        ! [ -z "${CONTAINER_ID}" ] && {
            log_message "Stop container $CONTAINER_ID"
            docker stop ${CONTAINER_ID}
        }
        ;;

    c | connect )
        CONTAINER_ID="$(docker ps -q -f=ancestor=argue-bot:latest)"
        if [ -z "${CONTAINER_ID}" ]; then log_message "Can't find running container with name 'postgres'" ${RED}; fi

        ! [ -z "${CONTAINER_ID}" ] && {
            docker exec -it ${CONTAINER_ID} bash
        }
        ;;

     cl | clean )
        docker stop $(docker ps -qa -f ancestor=sargue-bot) 2> /dev/null
        docker rm -f $(docker ps -qa -f ancestor=sargue-bot) 2> /dev/null
        docker rmi -f $(docker images argue-bot -q) 2> /dev/null
        docker rmi node:10.8.0
        ;;

    * )
        echo -e "Basic actions with argue-bot container"
        echo -e "\nCommands:"
        echo -e "  b,  build\tBuild and tag image as latest"
        echo -e "  r,  run\tRun image tagged as latest"
        echo -e "  s,  stop\tStop running container"
        echo -e "  c,  connect\tConnect to running container"
        echo -e "  cl, clear\tRemove all project related docker images and containers"
        ;;
esac