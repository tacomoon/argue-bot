#!/usr/bin/env bash
cd "$(dirname "$0")"

NC='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'

ACCESS_TOKEN='paste_your_access_token_here'

function log_message() {
    echo -e ${1}
}

function log_error() {
    echo -e "${RED}${1}${NC}" >&2
}

function print_help() {
    echo -e "Commands:"
    echo -e "  b,  build\tBuild and tag image as latest"
    echo -e "  r,  run\tRun image tagged as latest"
    echo -e "  s,  stop\tStop running container"
    echo -e "  c,  connect\tConnect to running container"
    echo -e "  l,  logs\tGet logs from running container"
    echo -e "  cl, clear\tRemove all project related docker images and containers"
    echo -e "\nCommand 'logs' options:"
    echo -e "  --tail\tGet only last 50 lines"
    echo -e "  --follow\tContinue streaming"
    echo -e "\nCommand 'clear' options:"
    echo -e "  --with-node\tDelete node image from docker too"
}

function build_container() {
    VERSION="$(date +'%s')"
    docker build -t argue-bot:${VERSION} .
    docker tag argue-bot:${VERSION} argue-bot:latest
}

function run_container() {
    stop_container 2> /dev/null
    log_message "starting container"
    docker run -d -p 8080:3000 -e ACCESS_TOKEN=${ACCESS_TOKEN} argue-bot:latest
}

function stop_container() {
    CONTAINER_ID="$(docker ps -q -f=ancestor=argue-bot:latest)"
    if [ -z "${CONTAINER_ID}" ]; then
        log_error "can't find running container"
        return 1
    fi

    ! [ -z "${CONTAINER_ID}" ] && {
        log_message "stopping container $CONTAINER_ID"
        docker stop ${CONTAINER_ID}
    }
}

function connect_to_container() {
    CONTAINER_ID="$(docker ps -q -f=ancestor=argue-bot:latest)"
    if [ -z "${CONTAINER_ID}" ]; then
        log_error "can't find running container"
        return 1
    fi

    ! [ -z "${CONTAINER_ID}" ] && {
        docker exec -it ${CONTAINER_ID} bash
    }
}

function get_logs_from_container() {
    CONTAINER_ID="$(docker ps -q -f=ancestor=argue-bot:latest)"
    if [ -z "${CONTAINER_ID}" ]; then
        log_error "can't find running container"
        return 1
    fi

    tail=false
    follow=false

    shift
    while [[ true ]]; do
        case ${1} in
            --tail )
                tail=true; shift
                ;;
            --follow )
                follow=true; shift
                ;;
            * )
                if ! [[ ${1} ]]; then break; fi;

                log_error "unknown flag: ${1} \n"
                print_help
                return 1
        esac
    done

    DOCKER_CMD="docker logs"
    if ${tail}; then
        DOCKER_CMD="${DOCKER_CMD} --tail 50"
    fi
    if ${follow}; then
        DOCKER_CMD="${DOCKER_CMD} --follow"
    fi
    DOCKER_CMD="${DOCKER_CMD} ${CONTAINER_ID}"

    eval ${DOCKER_CMD}
}

function clean_docker() {
    with_node=false

    shift
    if [[ ${1} ]]; then
        case ${1} in
            --with-node )
                with_node=true
                ;;
        * )
            log_error "unknown flag: ${1} \n"
            print_help
            return 1
        esac
    fi

    stop_container 2> /dev/null
    log_message "removing related containers"
    docker rm -f $(docker ps -qa -f ancestor=argue-bot) 2> /dev/null
    log_message "removing related images"
    docker rmi -f $(docker images argue-bot -q) 2> /dev/null

    if ${with_node}; then
        log_message "removing related node"
        docker rmi node:10.8.0
    fi
}

case ${1} in
    b | build ) build_container ;;
    r | run ) run_container ;;
    s | stop ) stop_container;;
    c | connect ) connect_to_container ;;
    l | logs ) get_logs_from_container $@ ;;
    cl | clean ) clean_docker $@ ;;
    * )
        if [[ ${1} ]]; then
            log_error "unknown command: ${1} \n"
        fi
        print_help
    ;;
esac