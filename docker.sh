#!/usr/bin/env bash

NC='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'

ACCESS_TOKEN=''

function log_message() {
    echo -e ${1}
}

function log_error() {
    echo -e ${RED}${1}${NC} >&2
}

function print_help() {
    echo -e "\nCommands:"
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

function find_running_container() {
    CONTAINER_ID=$(docker ps -q -f=ancestor=argue-bot:latest)
}

function check_access_token {
    if [ -z ${ACCESS_TOKEN} ]; then
        log_error 'ACCESS_TOKEN is required, visit https://vk.com/dev/access_token to get one'
        exit 1
    fi
}

function check_container_running {
    if [ -z ${CONTAINER_ID} ]; then
        find_running_container
    fi

    if [ -z ${CONTAINER_ID} ]; then
        log_error "Can't find running digital-diary database container"
        exit 1
    fi
}

function soft_stop_container {
    find_running_container

    if [ ${CONTAINER_ID} ]; then
        log_message "Stopping running container $CONTAINER_ID"
        docker stop ${CONTAINER_ID}
    fi
}

function build_docker_log_query {
    tail=false
    follow=false
    shift

    while [[ true ]]; do
        case ${1} in
            --tail )
                tail=true
                shift
                ;;
            --follow )
                follow=true
                shift
                ;;
            * )
                if [ -z ${1} ]; then break; fi

                log_error "Unknown flag: ${1}"
                print_help
                exit 1
        esac
    done

    DOCKER_CMD="docker logs"
    if ${tail}; then
        DOCKER_CMD=${DOCKER_CMD} --tail 50
    fi
    if ${follow}; then
        DOCKER_CMD=${DOCKER_CMD} --follow
    fi
    DOCKER_CMD=${DOCKER_CMD} ${CONTAINER_ID}
}

function clean_docker() {
    with_node=false
    shift

    if [[ ${1} ]]; then
        case ${1} in
            --with-node )
                with_node=true
                shift
                ;;
        * )
            if [ -z ${1} ]; then break; fi

            log_error "unknown flag: ${1}"
            print_help
            exit 1
        esac
    fi

    # Removing related containers
    DOCKER_CMD=docker rm -f $(docker ps -qa -f ancestor=argue-bot) 2> /dev/null
    # Removing related images
    DOCKER_CMD=${DOCKER_CMD} && docker rmi -f $(docker images argue-bot -q) 2> /dev/null
    # Removing node
    if ${with_node}; then
        DOCKER_CMD=${DOCKER_CMD} && docker rmi node:10.8.0
    fi
}

case ${1} in

    b | build )
        VERSION=$(date +'%s')
        DOCKER_CONTEXT=$(dirname ${0})

        docker build -t argue-bot:${VERSION} ${DOCKER_CONTEXT}
        docker tag argue-bot:${VERSION} argue-bot:latest
        ;;

    r | run )
        check_access_token
        soft_stop_container
        log_message "starting container"
        docker run -d -p 8080:3000 -e ACCESS_TOKEN=${ACCESS_TOKEN} argue-bot:latest
        ;;

    c | connect )
        check_container_running
        docker exec -it ${CONTAINER_ID} bash
        ;;

    s | stop )
        check_container_running
        soft_stop_container
        ;;

    l | logs )
        check_container_running
        build_docker_log_query $@
        eval ${DOCKER_CMD}
        ;;

    cl | clear )
        soft_stop_container
        clean_docker $@
        eval ${DOCKER_CMD}
        ;;

    * )
        if [ ${1} ]; then log_error "unknown command: ${1}"; fi
        print_help
esac